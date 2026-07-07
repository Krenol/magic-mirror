# Magic Mirror

A personalized smart display dashboard showing real-time weather, calendar events, birthdays, and time — built for always-on displays (originally Raspberry Pi).

**Stack:** React · TypeScript · Vite · Nginx

Magic Mirror is a fully static, client-side app. There is no backend server or
database — the browser calls external APIs (Open-Meteo, geocode.maps.co,
db.transport.rest, Google Calendar) directly, and signs in to Google using
[Google Identity Services](https://developers.google.com/identity/gsi/web).
Settings and API keys are stored only in your browser (`localStorage`).

---

## Prerequisites

| Tool | Purpose |
|------|---------|
| [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/) | Deployment automation |
| Google Cloud project with an OAuth Client ID | Google Calendar sign-in |

A [Geocode Maps API key](https://geocode.maps.co/) is needed too, but it's
entered by each user in the app's Settings screen — see
[api-keys.md](api-keys.md) for details. It's not a deploy-time secret.

---

## First-Time Setup

### 1. Google OAuth Client ID

1. Open [Google Cloud Console](https://console.cloud.google.com/) and create (or select) a project.
2. Enable the **Google Calendar API** under *APIs & Services → Library*.
3. Go to *APIs & Services → Credentials* → **Create Credentials → OAuth 2.0 Client ID**.
4. Application type: **Web application**.
5. Add **Authorized JavaScript origins** for wherever the app is served, e.g.:
   ```
   https://<your-hostname>.<domain>
   http://localhost:3000
   ```
   Google Identity Services uses this (not a redirect URI) to authorize the in-browser sign-in flow.
6. Save the **Client ID**. It's not a secret — it's already set in `ansible/inventory/group_vars/all/main.yml` as `google_client_id`, and gets baked into the frontend build.

### 2. Generate SSL Certificates

Run the cert playbook. It installs [mkcert](https://github.com/FiloSottile/mkcert) automatically if missing and generates locally-trusted certificates.

```bash
ansible-playbook ansible/setup_certs.yml
```

Supported platforms: **Ubuntu**, **Debian**, **macOS**.

This creates `frontend/ssl/<hostname>.pem` + `.key` — the TLS certificate nginx uses to serve the app over HTTPS (the app's only exposed entrypoint).

> **macOS:** Requires [Homebrew](https://brew.sh/). Run `brew install mkcert` manually if Homebrew is not in the system `PATH` when running as `localhost`.

### 3. Configure the Vault

Copy the vault example and fill in your GitHub Container Registry credentials (used to pull the frontend image):

```bash
cp ansible/vault.yml.example ansible/vault.yml
ansible-vault encrypt ansible/vault.yml
```

There's no `.env` file generation step anymore — the only deploy-time secret is the GHCR pull credential.

### 4. DNS / Hosts Resolution

The application uses your machine's hostname with the configured domain suffix (e.g. `mymachine.fritz.box`). Make sure this resolves on your network.

**Option A — `/etc/hosts` (local machine only):**
```
127.0.0.1   mymachine.fritz.box
```

**Option B — Router DNS:** Point `*.fritz.box` (or the specific hostname) to your machine's IP. Most home routers (e.g. Fritz!Box) support static DNS entries.

### 5. Start the Application

**Development** (hot reload, no deployment):
```bash
cd frontend
yarn dev
```

Or run the same static site the way it's deployed, via k3s (see [LOCAL_DEV.md](LOCAL_DEV.md)):
```bash
./scripts/dev.sh up
```

**Production:** see [Deployment](#deployment) below.

Open the app in your browser. There's no login gate — the dashboard loads immediately, showing weather/trains/clock. Click **Sign in with Google** in Settings to enable birthdays and calendar events.

---

## Post-Setup Configuration

Visit `/settings` to configure:

- **Location** — city, country, or zip code for weather
- **Geocode Maps API key** — required for location lookup, see [api-keys.md](api-keys.md)
- **Google Account** — sign in to enable birthdays and calendar events
- **Events / Birthday calendar** — Google Calendar ID for each
- **Train connections** — optional departure board widget

---

## Architecture

```
Browser
  ├── Nginx (static files + TLS termination)
  ├── Google Identity Services  ──► Google Calendar API (events, birthdays, calendar list)
  ├── Open-Meteo, OpenWeatherMap icons  (weather)
  ├── geocode.maps.co  (location lookup, user-supplied API key)
  ├── db.transport.rest  (train departures)
  └── localStorage  (settings, API keys, Google token)
```

There is no backend server, database, or auth proxy. Nginx serves the static
build and terminates TLS; everything else is a direct browser-to-API call.

---

## Development Commands

```bash
cd frontend
yarn dev          # Dev server on :3000 with hot reload
yarn build        # Production build (TypeScript + Vite)
yarn lint         # ESLint
yarn test         # Vitest unit tests
```

---

## Deployment

For deployment to a server or Raspberry Pi, use the Ansible playbooks:

```bash
# Deploy the static frontend to a server via k3s
ansible-playbook ansible/server_setup.yml -i ansible/inventory/

# Set up a Raspberry Pi kiosk display
ansible-playbook ansible/rpi_setup.yml -i ansible/inventory/
```

Configure your inventory hosts and variables in `ansible/inventory/`.

---

[Impressum](impressum.md) | [Privacy Policy](privacy.md) | [API Keys](api-keys.md)
