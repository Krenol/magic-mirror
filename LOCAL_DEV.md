# Local Development

Magic Mirror is a static frontend with no backend, database, or auth proxy —
it calls external APIs directly from the browser. There are two ways to run
it locally:

- **`yarn dev`** (simplest) — runs the Vite dev server directly on your machine.
- **`./scripts/dev.sh`** — runs the same static build inside k3s (or k3d on
  WSL2), matching how it's actually deployed in production.

The dev script auto-detects the environment and uses the appropriate runtime:

- **Native Linux** — k3s (direct)
- **WSL2 (Ubuntu/AMD64)** — k3d (k3s-in-Docker), which avoids known k3s
  incompatibilities with the WSL2 kernel

## Prerequisites

### Native Linux

| Tool   | Install |
|--------|---------|
| k3s    | `curl -sfL https://get.k3s.io \| INSTALL_K3S_EXEC="server --disable traefik --flannel-backend=none --disable-network-policy" sh -` |

Verify k3s is running:

```bash
sudo k3s kubectl get nodes
```

### WSL2

| Tool    | Install |
|---------|---------|
| Docker  | [Docker Engine](https://docs.docker.com/engine/install/) or Docker Desktop |
| k3d     | `curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh \| bash` |
| kubectl | [kubernetes.io/docs/tasks/tools](https://kubernetes.io/docs/tasks/tools/) |

Verify Docker is running, then:

```bash
k3d cluster list
kubectl version --client
```

## Quick Start

```bash
./scripts/dev.sh up
```

## Access

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:30000 |

Google Sign-In requires `http://localhost:30000` to be added as an
**Authorized JavaScript origin** for the OAuth Client ID in Google Cloud
Console (see [README.md](README.md#1-google-oauth-client-id)) — Google allows
plain `http://` for `localhost` origins specifically.

## Commands

```bash
./scripts/dev.sh up              # Start the dev environment
./scripts/dev.sh down            # Stop (preserves data)
./scripts/dev.sh status          # Show pod status
./scripts/dev.sh logs            # Tail all logs
./scripts/dev.sh logs frontend   # Tail frontend logs only
./scripts/dev.sh reset           # Stop and delete all dev data
```

## How It Works

The dev environment runs in a `magic-mirror-dev` namespace (on k3s natively,
or inside a k3d cluster on WSL2), separate from any production deployment.

The frontend pod runs `node:24-alpine` with `yarn dev` (Vite dev server),
mounting `frontend/src/` and `frontend/public/` for hot reload. Source
directories are mounted read-only via `hostPath` volumes. `node_modules` and
the Yarn cache are stored in `.dev/` (git-ignored) to avoid conflicts with
host-installed dependencies.

There's no TLS in the dev environment — the frontend is served over plain
HTTP, which is sufficient for Google Identity Services on `localhost` origins.

## Troubleshooting

**Pod stuck in ContainerCreating:**
Check that the repo path is accessible by the runtime. On native k3s, you may
need to allow the k3s user to read the repo directory. On k3d, the repo root
is automatically volume-mounted into the cluster node.

**Frontend crash-looping:**
Check logs with `./scripts/dev.sh logs frontend`. The first start takes
longer because `yarn install` runs inside the pod.

**Reset everything:**
```bash
./scripts/dev.sh reset
```
This deletes the namespace and all dev data.
