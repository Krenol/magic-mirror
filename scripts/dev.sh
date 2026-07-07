#!/usr/bin/env bash
#
# Local development environment for Magic Mirror using k3s (or k3d on WSL2).
#
# The app is a static frontend with no backend - it calls external APIs
# (Open-Meteo, geocode.maps.co, db.transport.rest, Google Calendar) directly
# from the browser, so this script only runs the frontend dev server.
#
# Usage:
#   ./scripts/dev.sh up      Start the dev environment
#   ./scripts/dev.sh down    Stop the dev environment
#   ./scripts/dev.sh status  Show pod status
#   ./scripts/dev.sh logs    Tail logs for all pods
#   ./scripts/dev.sh reset   Tear down and clean all dev data
#
# Prerequisites (native Linux):
#   - k3s installed (https://k3s.io)
#   - kubectl available (comes with k3s)
#
# Prerequisites (WSL2):
#   - Docker Desktop or Docker Engine running
#   - k3d installed (https://k3d.io)
#   - kubectl installed (https://kubernetes.io/docs/tasks/tools/)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEV_DIR="${REPO_ROOT}/.dev"
RENDERED_DIR="${DEV_DIR}/rendered"
MANIFEST_DIR="${REPO_ROOT}/k8s/dev"
NAMESPACE="magic-mirror-dev"

# ── Runtime detection ────────────────────────────────────────────────────────

IS_WSL2=false
if grep -qi "microsoft\|wsl" /proc/sys/kernel/osrelease 2>/dev/null; then
  IS_WSL2=true
fi

K3D_CLUSTER="magic-mirror-dev"

if $IS_WSL2; then
  KUBECTL="kubectl"
else
  KUBECTL="k3s kubectl"
fi

# ── Helpers ───────────────────────────────────────────────────────────────────

info()  { printf '\033[1;34m==> %s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m==> %s\033[0m\n' "$*"; }
err()   { printf '\033[1;31m==> %s\033[0m\n' "$*" >&2; }

check_prereqs() {
  local missing=()

  if $IS_WSL2; then
    command -v docker  >/dev/null 2>&1 || missing+=(docker)
    command -v k3d     >/dev/null 2>&1 || missing+=(k3d)
    command -v kubectl >/dev/null 2>&1 || missing+=(kubectl)
  else
    command -v k3s >/dev/null 2>&1 || missing+=(k3s)
  fi
  command -v envsubst >/dev/null 2>&1 || missing+=(envsubst)

  if [[ ${#missing[@]} -gt 0 ]]; then
    err "Missing prerequisites: ${missing[*]}"
    if $IS_WSL2; then
      echo "Install Docker:   https://docs.docker.com/engine/install/"
      echo "Install k3d:      curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash"
      echo "Install kubectl:  https://kubernetes.io/docs/tasks/tools/"
    else
      echo "Install k3s:      curl -sfL https://get.k3s.io | sh -"
    fi
    echo "Install envsubst: apt install gettext-base"
    exit 1
  fi

  if $IS_WSL2; then
    if ! docker info >/dev/null 2>&1; then
      err "Docker daemon is not running. Start Docker Desktop or the Docker service."
      exit 1
    fi
  fi
}

# ── k3d cluster management (WSL2 only) ──────────────────────────────────────

ensure_k3d_cluster() {
  if k3d cluster list 2>/dev/null | grep -q "^${K3D_CLUSTER} "; then
    info "k3d cluster '${K3D_CLUSTER}' exists, ensuring it is running"
    k3d cluster start "${K3D_CLUSTER}" 2>/dev/null || true
  else
    info "Creating k3d cluster '${K3D_CLUSTER}'"
    k3d cluster create "${K3D_CLUSTER}" \
      --volume "${REPO_ROOT}:${REPO_ROOT}" \
      --port "30000:30000@server:0" \
      --k3s-arg '--disable=traefik@server:0'
  fi

  # Ensure kubectl context points to our cluster
  kubectl config use-context "k3d-${K3D_CLUSTER}" >/dev/null 2>&1
}

# ── Render manifests ──────────────────────────────────────────────────────────

render_manifests() {
  info "Rendering manifests (REPO_ROOT=${REPO_ROOT})"
  mkdir -p "${RENDERED_DIR}"

  # envsubst with an explicit variable list only substitutes the named
  # placeholders, leaving any other ${...} content untouched. This is robust
  # against arbitrary characters (including '|' or '/') appearing in the
  # values, unlike sed-based replacement.
  export REPO_ROOT
  for f in "${MANIFEST_DIR}"/*.yml; do
    envsubst '${REPO_ROOT}' \
      < "$f" > "${RENDERED_DIR}/$(basename "$f")"
  done
}

# ── Commands ──────────────────────────────────────────────────────────────────

cmd_up() {
  check_prereqs
  mkdir -p "${DEV_DIR}"
  trap 'rm -rf "${RENDERED_DIR}"' EXIT

  if $IS_WSL2; then
    ensure_k3d_cluster
  fi

  render_manifests

  info "Applying namespace"
  $KUBECTL apply -f "${RENDERED_DIR}/namespace.yml"

  info "Starting frontend"
  $KUBECTL apply -f "${RENDERED_DIR}/frontend.yml"

  info "Waiting for pod to start (this may take a while for yarn install)..."
  $KUBECTL wait --for=condition=Ready pod -l app=frontend -n "${NAMESPACE}" --timeout=210s

  echo ""
  ok "Dev environment is running!"
  if $IS_WSL2; then
    echo "  (using k3d on WSL2)"
  fi
  echo ""
  echo "  Frontend: http://localhost:30000"
  echo ""
  echo "  Google Sign-In requires 'http://localhost:30000' (or your configured"
  echo "  port) to be added as an Authorized JavaScript origin for the OAuth"
  echo "  Client ID in Google Cloud Console."
  echo ""
  echo "  Logs:           ./scripts/dev.sh logs"
  echo "  Status:         ./scripts/dev.sh status"
  echo ""
}

cmd_down() {
  info "Stopping dev environment"
  if $IS_WSL2; then
    # Delete namespace but keep the k3d cluster for faster restarts
    $KUBECTL delete namespace "${NAMESPACE}" --ignore-not-found 2>/dev/null || true
    k3d cluster stop "${K3D_CLUSTER}" 2>/dev/null || true
  else
    $KUBECTL delete namespace "${NAMESPACE}" --ignore-not-found
  fi
  ok "Dev environment stopped"
}

cmd_status() {
  if $IS_WSL2; then
    echo "Runtime: k3d (WSL2)"
    k3d cluster list 2>/dev/null | grep "^${K3D_CLUSTER} " || echo "k3d cluster '${K3D_CLUSTER}' not found"
    echo ""
  fi
  $KUBECTL get pods,svc -n "${NAMESPACE}" -o wide 2>/dev/null || echo "Namespace ${NAMESPACE} not found"
}

cmd_logs() {
  local target="${1:-}"
  if [[ -n "$target" ]]; then
    $KUBECTL logs -f -n "${NAMESPACE}" -l "app=${target}"
  else
    $KUBECTL logs -f -n "${NAMESPACE}" --all-containers --prefix --max-log-requests=10
  fi
}

cmd_reset() {
  info "Tearing down dev environment and cleaning data"
  if $IS_WSL2; then
    k3d cluster delete "${K3D_CLUSTER}" 2>/dev/null || true
  else
    $KUBECTL delete namespace "${NAMESPACE}" --ignore-not-found
  fi
  rm -rf "${DEV_DIR}"
  ok "Dev environment reset"
}

# ── Main ──────────────────────────────────────────────────────────────────────

case "${1:-help}" in
  up)     cmd_up ;;
  down)   cmd_down ;;
  status) cmd_status ;;
  logs)   shift; cmd_logs "$@" ;;
  reset)  cmd_reset ;;
  *)
    echo "Usage: $0 {up|down|status|logs [app]|reset}"
    echo ""
    if $IS_WSL2; then
      echo "Runtime: k3d (WSL2 detected)"
    else
      echo "Runtime: k3s (native Linux)"
    fi
    echo ""
    echo "Commands:"
    echo "  up      Start the dev environment"
    echo "  down    Stop the dev environment (preserves data)"
    echo "  status  Show pod and service status"
    echo "  logs    Tail logs (optionally filter: logs frontend)"
    echo "  reset   Tear down and delete all dev data"
    exit 1
    ;;
esac
