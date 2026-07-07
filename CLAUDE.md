# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Magic Mirror is a personalized smart display dashboard application that shows real-time weather, calendar events, birthdays, train departures, and time. It's a **fully static, client-side-rendered app with no backend server or database** — the browser calls external APIs directly and signs in to Google using Google Identity Services (GIS). Originally designed for Raspberry Pi displays.

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Material-UI + Yarn as package manager
- Auth: Google Identity Services (GIS) — in-browser OAuth2 token client, no server-side auth
- Hosting: Nginx (static files + TLS termination), Kubernetes (k3s) + Ansible for deployment

## Development Commands

Run from `/frontend`:

```bash
yarn dev              # Dev server on port 3000 with hot reload
yarn build            # Production build (TypeScript + Vite)
yarn lint             # Run ESLint
yarn lint:fix         # Auto-fix ESLint issues
yarn format           # Run Prettier
yarn test             # Run Vitest unit tests
yarn test:ui          # Vitest UI
yarn test:coverage    # Coverage report
```

### k3s dev environment (matches production deployment)

```bash
./scripts/dev.sh up      # Start (frontend only, in a magic-mirror-dev namespace)
./scripts/dev.sh down    # Stop
./scripts/dev.sh status  # Pod status
./scripts/dev.sh logs    # Tail logs
./scripts/dev.sh reset   # Tear down and clean dev data
```

See [LOCAL_DEV.md](LOCAL_DEV.md) for details.

## Architecture Overview

### Request Flow

```
Browser
  ├── Nginx (static files + TLS termination) — the only server-side component
  ├── Google Identity Services  ──►  Google Calendar API (events, birthdays, calendar list)
  ├── Open-Meteo, OpenWeatherMap icons  (weather — keyless)
  ├── geocode.maps.co  (location lookup — user-supplied API key)
  ├── db.transport.rest  (train departures — keyless, Deutsche Bahn public API)
  └── localStorage / sessionStorage  (settings, API keys, Google token)
```

**Critical:** There is no backend server, database, or auth proxy. Every external API call is made directly from the browser. Nginx's only job is serving the static build and terminating TLS.

### Frontend Structure

**Component-based with Context + React Query:**

```
frontend/src/
├── main.tsx              # Entry point
├── App.tsx               # Router setup (/, /settings, /error), shared QueryClient
├── routes/
│   ├── Dashboard.tsx     # Main dashboard (wraps components in contexts)
│   ├── Settings.tsx      # User settings form
│   ├── ErrorPage.tsx     # Query-param-driven error display
│   └── RouteErrorPage.tsx # Router errorElement (status-code-driven)
├── components/           # UI components (each in own folder)
│   ├── current_weather/  # Current temperature display
│   ├── hourly_forecast/  # Hourly weather
│   ├── daily_forecast/   # Daily weather
│   ├── birthdays/        # Upcoming birthdays (gated on Google sign-in)
│   ├── upcoming_events/  # Calendar events (gated on Google sign-in)
│   ├── train_times/      # Train departure board
│   ├── time/             # Clock display
│   ├── settings_form/    # Settings editor (location, API keys, Google sign-in, calendars, trains)
│   └── appbar/           # Top navigation bar
├── apis/                 # React Query hooks — call services/ (below), never a backend
│   ├── current_weather.ts, daily_weather.ts, hourly_weather.ts, weather_icon.ts
│   ├── trains.ts
│   ├── geocode.ts
│   ├── events.ts, birthday.ts, calendar_list.ts   # Google Calendar, gated on sign-in
│   └── user_settings.ts, users.ts                 # localStorage-backed
├── services/             # Business logic ported from the old Express backend,
│   │                     # plus new client-only concerns (auth, storage)
│   ├── weather/          # weatherCodes.ts, daynight.ts, openMeteo.ts
│   ├── trains/           # deutscheBahn.ts
│   ├── geocode.ts
│   ├── googleAuth.ts     # GIS token client wrapper (sign in/out, silent refresh)
│   ├── googleCalendar.ts # Google Calendar API v3 calls + response reshaping
│   └── localStorage.ts   # Safe get/set/clear helpers
├── hooks/
│   ├── useApiKeys.ts     # localStorage-backed user-supplied API keys
│   └── useGoogleAuth.ts  # React-facing wrapper around services/googleAuth.ts
├── common/
│   ├── LocationContext.tsx  # Resolves lat/long from settings + geocode API
│   ├── TimeContext.tsx      # Manages timezone, triggers hourly/daily updates
│   ├── externalFetch.ts     # fetch wrapper WITHOUT credentials — use for all
│   │                         # third-party API calls (see below)
│   ├── queryClient.ts       # Shared QueryClient singleton (used outside React
│   │                         # too, e.g. by non-hook localStorage writes)
│   └── dateParser.ts        # Date helpers, incl. exact getTimeDiff/TimeUnit
└── models/               # TypeScript interfaces
```

**State Management:**
- **Server state:** React Query (caching, refetching, loading/error states)
- **Global app state:** Context API (LocationContext, TimeContext)
- **Persisted state:** `localStorage` (settings, API keys) and `sessionStorage` (Google token)

Dashboard component wraps everything in providers:
```tsx
<LocationContextProvider>  {/* Fetches user location from settings, geocodes to coords */}
  <TimeContextProvider>     {/* Manages timezone, triggers hourly/daily updates */}
    {/* Weather/Events/Birthday components use both contexts */}
  </TimeContextProvider>
</LocationContextProvider>
```

## Authentication Architecture

**Google Identity Services (GIS), entirely client-side:**

1. The app loads with no login gate — weather, trains, and the clock work immediately.
2. The user clicks "Sign in with Google" in Settings, which calls `services/googleAuth.ts`'s `signIn()`.
3. GIS's token client shows a consent popup and returns a short-lived Calendar-scoped (`calendar.readonly`) access token.
4. The token is cached in `sessionStorage`; `getAccessToken()` silently refreshes it when expired.
5. `services/googleCalendar.ts` calls `https://www.googleapis.com/calendar/v3/...` directly with `Authorization: Bearer <token>`.
6. Birthdays/Events widgets and the Settings calendar picker are gated on `useGoogleAuth().isSignedIn`.

**There is no server-side auth of any kind.** Never add a backend, session cookie, or reverse-auth-proxy for this — it's a deliberate architectural choice (see git history for the SSR→CSR migration).

## External APIs Called Directly From the Browser

| API | Used for | Key required? |
|-----|----------|----------------|
| `api.open-meteo.com` | Current/hourly/daily weather | No |
| `openweathermap.org` (icon CDN) | Weather icons | No |
| `geocode.maps.co` | City/country/zip → coordinates | Yes — user-supplied, see `api-keys.md` |
| `v6.db.transport.rest` | Train stations, connections | No |
| `www.googleapis.com/calendar/v3` | Events, birthdays, calendar list | Google OAuth token (GIS) |

**Always use `common/externalFetch.ts` for these calls, never `fetch()` directly and never with credentials.** Sending `credentials:'include'` (or cookies) to a third-party API causes the browser to require a non-wildcard CORS response, which these APIs don't return — the request will be silently blocked.

## Settings & API Keys

`UserSettings` (location, calendar IDs, dashboard widget layout, train connections) lives entirely in `localStorage`, written via `apis/user_settings.ts`/`apis/users.ts`. There is no cross-device sync — settings are per-browser.

User-supplied API keys (Geocode Maps, optionally OpenWeatherMap) live in `localStorage` via `hooks/useApiKeys.ts`, entered in the Settings screen. `api-keys.md` (linked from Settings) explains how to obtain them — keep it up to date if the required keys change.

## Adding a New External API Integration

1. **Add a service module** under `frontend/src/services/` — pure functions that build the request URL and reshape the response, using `common/externalFetch.ts`'s `externalFetchJson`. Keep backend-style reshaping logic (e.g. weathercode→icon mapping) here, not in components.
2. **Add a React Query hook** in `frontend/src/apis/` that calls the service function inside `queryFn`. Configure `staleTime`/`refetchInterval` as appropriate.
3. **Use the hook in a component** under `frontend/src/components/`.
4. If the API needs a key, extend `hooks/useApiKeys.ts` and the Settings form, and document how to obtain it in `api-keys.md`.
5. If the API needs Google auth, gate the query's `enabled` on `useGoogleAuth().isSignedIn` and call `getAccessToken()` from `services/googleAuth.ts` inside `queryFn`.

## React Query Configuration

Global config in `App.tsx` (via `common/queryClient.ts`):
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      retry: 2,
      retryDelay: 300,
      staleTime: 60000, // 1 minute
    },
  },
})
```

## Testing

**Frontend tests:** Vitest + Testing Library
- Location: `frontend/src/tests/`
- `tests/services/` — unit tests for ported business logic (weather-code mapping, day/night detection, train journey reshaping, Google Calendar event reshaping, GIS auth token handling)
- `tests/apis/` — React Query hook tests, mocking the underlying `services/*` module
- `tests/contexts/`, `tests/hooks/`, `tests/utils/` — context/hook/utility tests
- Run all: `yarn test`
- Run one file: `yarn test src/tests/services/googleCalendar.test.ts`

When porting or adding reshaping logic (e.g. date-diff math), watch for floating-point pitfalls — prefer exact integer-safe division (see `common/dateParser.ts`'s `getTimeDiff`) over approximate multiplication constants when the result needs to hit an exact value (like a 24-hour all-day-event boundary).

## Deployment

**Kubernetes (k3s) + Ansible**, not Docker Compose (there is no `docker-compose/` directory in this repo). See `k8s/templates/` (production, Jinja2-templated) and `k8s/dev/` (local dev).

- `frontend` — the only deployed service: an Nginx container serving the Vite build. Listens on port 3000 (plain HTTP, used internally for k8s health probes) and port 8443 (TLS, the app's only externally-reachable entrypoint — mapped to external port 443 via the k8s Service's NodePort).
- TLS certs come from `ansible/roles/generate_certs` (mkcert, for `*.fritz.box`-style local domains) or cert-manager/Let's Encrypt (`letsencrypt_enabled: true`).

**Ansible playbooks:**
- `ansible/server_setup.yml` — deploys the frontend to a server via k3s (role: `setup_server`, which also handles generic host provisioning: package installs, k3s install, cert generation — not backend-specific despite historical naming of its predecessor).
- `ansible/rpi_setup.yml` — sets up a Raspberry Pi kiosk display (Firefox pointed at the deployed frontend URL).
- `ansible/setup_certs.yml` — generates local mkcert certificates for dev.

## Important Patterns & Conventions

1. **No backend.** Don't add one. If a feature seems to need server-side secrets, prefer a user-supplied API key (like Geocode Maps) over a shared server-side credential.

2. **External fetches never send credentials.** Use `common/externalFetch.ts`, not bare `fetch()` with cookies, for any call to a third-party API.

3. **Settings persistence:** `localStorage` via `apis/user_settings.ts`, `apis/users.ts`, `hooks/useApiKeys.ts` — not a database. No cross-device sync.

4. **Google auth:** `services/googleAuth.ts` (token lifecycle) + `hooks/useGoogleAuth.ts` (React-facing). Gate any Google Calendar-dependent query/UI on `isSignedIn`.

5. **Context Usage:** LocationContext provides coords for weather (via user settings + geocode API + user's Geocode Maps key). TimeContext triggers periodic refetches.

6. **TypeScript:** Frontend uses Vite + TypeScript with `noUnusedLocals`/`noUnusedParameters` enabled — don't leave stale parameters when refactoring hook signatures.

7. **Docs page:** `api-keys.md` at repo root (served the same way as `privacy.md`/`impressum.md`) explains how to obtain the Geocode Maps API key — keep it in sync with `hooks/useApiKeys.ts`.
