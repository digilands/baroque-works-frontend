# Architecture

## Overview

BaroqueWorks is a Next.js App Router application serving as the frontend for a handyman services marketplace connecting clients with local trade professionals across Nigeria. It talks to a NestJS backend via a **BFF (Backend for Frontend)** pattern: browser code calls Next.js Route Handlers under `src/app/api/`, which proxy to the backend while managing session cookies.

Rendering is **hybrid**: public/landing pages and the dashboard shell are React Server Components that fetch from the backend directly via `src/lib/server/`; interactive flows (auth forms, onboarding, booking, map pickers) are client components using TanStack Query against the BFF.

## Tech Stack

| Layer           | Technology                                              |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js 16.3.5 (App Router, Turbopack dev)              |
| UI Library      | React 19                                                |
| Language        | TypeScript (strict)                                     |
| Styling         | Tailwind CSS v4 (CSS-first config) + MUI v7             |
| Forms           | Formik + Yup                                            |
| Data fetching   | TanStack Query (client) + server queries (RSC)          |
| HTTP            | Axios (two instances)                                   |
| Auth            | JWT (HTTP-only cookies) + Google OAuth                   |
| Maps            | Mapbox GL JS                                            |
| Payments        | Monnify (redirect checkout)                             |
| Media           | Cloudinary uploads                                      |
| Live updates    | SSE (short-lived streams + auto-reconnect)              |
| Animation       | Framer Motion, CSS animations, keen-slider, Swiper      |
| Charts          | Recharts                                                |
| Icons           | Hugeicons, Lucide React                                 |
| Theming         | next-themes (class-based dark mode)                     |
| Package manager | pnpm                                                    |
| Testing         | Vitest (unit), Playwright (E2E)                         |
| Schema          | OpenAPI types generated from backend Swagger            |

## Directory Structure

```
src/
  proxy.ts                  # Request middleware (Next 16.3: was middleware.ts)
  app/
    page.tsx                # Landing page (/) — RSC, fetches categories
    layout.tsx              # Root layout (server component + metadata)
    ClientProviders.tsx     # Client wrapper (QueryClient, Theme, etc.)
    (pages)/                # Route group (no URL segment) — public browsing
      home/                 # /home — RSC service feed + map view
      services/[id]/        # /services/:id — RSC detail + booking (client)
      search/               # /search — unified search w/ map toggle
      review/               # /review — post-service review
    auth/                   # /auth/* — auth + onboarding flow
      login/ signup/        # Formik forms (client)
      role-selection/       # First-time role pick (client)
      onboarding/client/    # Client onboarding (client)
      serviceselection/     # Handyman category pick (client)
      profilesetup/         # Handyman profile (client, draft-persisted)
      additional-info/      # Handyman skills/media (client)
    dashboard/              # /dashboard — role-aware, RSC-gated
      page.tsx              # RSC gate: auth → role → profile completeness
      jobs/ services/ bookings/ profile/ disputes/
      jobs/[id]/ jobs/create/ jobs/[id]/edit/ services/create/ ...
    admin/                  # /admin — separate console (admin login)
      login/ catalog/ page.tsx
    api/                    # BFF Route Handlers (36 routes, see api-routes.md)
      auth/ categories/ handymen/ hirers/ jobs/ services/
      bookings/ disputes/ uploads/ users/ admin/ sse/
  components/
    landing/ dashboard/ ui/ # Feature + shared UI components
  contexts/                 # ThemeProvider (next-themes)
  hooks/                    # useAuth, useOnboarding, useUpload, useGeolocation ...
  lib/
    auth.ts                 # internalApi (browser) + backendApi (server) + refresh
    api.ts                  # Client-side API functions (TanStack Query fns)
    api-proxy.ts            # BFF proxy helpers (proxyGet/Post/Put/Delete/Patch)
    api-errors.ts           # ApiError + toApiError normalization
    monnify.ts              # Payment intent helpers
    server/
      backend.ts            # Shared server backend client (RSC + route handlers)
      queries.ts            # RSC data layer (server-only)
      mappers.ts            # API → view-model formatters
      auth-redirect.ts      # Post-auth destination resolver
  types/
    api.d.ts                # Generated from context/swagger.yaml (pnpm gen:types)
    job.ts                  # View-model job types
  utils/
    cn.ts                   # Classname helper
    data.ts                 # nigerianStates + legacy onboarding constants only
e2e/                        # Playwright specs + global-setup
```

## Route Rendering Strategy

| Area                | Rendering | Notes |
| ------------------- | --------- | ----- |
| `/` landing         | RSC (`force-dynamic`) | `getCategories()` server-side |
| `/(pages)/home`     | RSC | Parallel `getCategories`/feed queries |
| `/(pages)/services/[id]` | RSC | Server fetch + client booking components |
| `/auth/*`           | Client    | Formik forms; onboarding draft in sessionStorage |
| `/dashboard`        | RSC gate  | `resolvePostAuthDestination()` then role dashboard |
| `/dashboard/*` inner | Mixed    | RSC pages + client widgets (TanStack Query, SSE) |
| `/admin*`           | Client    | Separate login, read-only views |
| `/api/*`            | Route handlers | BFF proxy to NestJS |

## Authentication Flow

Session is a JWT in an **HTTP-only cookie** (`accessToken`, 7 days; `refreshToken`, 30 days). The browser never sees the token.

```
Browser                    Next.js BFF (/api/*)              NestJS Backend
  |-- POST /api/auth/login ------>|                              |
  |                               |-- POST /auth/login ---------->|
  |                               |<-- { accessToken, refreshToken, user }
  |                               |-- Set-Cookie (both tokens) -->|
  |<-- { success, user } ---------|                              |
  |                               |                              |
  | (401 on any internalApi call) |                              |
  |                               |-- POST /auth/refresh -------->|  (single-flight)
  |                               |-- Set-Cookie (new access) --->|
  |<-- retry original request ----|                              |
```

- **`internalApi`** (browser): `baseURL: '/api'`, interceptor auto-refreshes once on 401 (excluding auth routes).
- **`backendApi`** (server): `baseURL: NEXT_PUBLIC_API_URL`, used by BFF handlers and RSCs.
- **Signup** returns tokens in the JSON body (backend sets no cookies) — the BFF signup route sets cookies itself.
- **Google OAuth**: backend redirects to `/api/auth/google/callback?token=...`; the callback sets cookies, fetches `/auth/me` + profile with the fresh token, then redirects by role/completeness via `resolvePostAuthDestination()` (`src/lib/server/auth-redirect.ts`): no session → login; no role → role selection; handyman w/o profile → service selection; client w/o hirer → client onboarding; else dashboard; admin → `/admin`.

## Route Protection

`src/proxy.ts` (Next 16.3's middleware replacement) matches `/dashboard/*`, `/auth/*`, `/admin/*`:

- **Dashboard**: requires `accessToken`, else redirect to `/auth/login?next=...`
- **Admin**: separate gate — no token → `/admin/login`; token on login page → `/admin`
- **Auth**: onboarding paths (`role-selection`, `onboarding`, `profilesetup`, `serviceselection`, `additional-info`) stay reachable while authenticated; logged-in users on login/signup → `/dashboard`
- **Profile completeness** is enforced in the dashboard RSC, not the proxy (proxy stays cookie-only and fast).

## BFF / Data Layer

1. **Route handlers** are thin wrappers over `src/lib/api-proxy.ts` (`proxyGet/Post/Put/Patch/Delete`) which call `src/lib/server/backend.ts` (`backendGet`, etc.).
2. **`backend.ts`** attaches `Authorization: Bearer <accessToken cookie>`, resolves `NEXT_PUBLIC_API_URL`, and normalizes backend errors to `ApiError`. It must not import `server-only` (route handlers share it; Turbopack fails otherwise).
3. **RSCs** use `src/lib/server/queries.ts` (`server-only`) for page data: `getSessionUser`, `getCategories`, `getJobs`, `getBookings`, `getMyHandymanProfile`, etc. List responses are normalized with `asArray()` because backend envelopes vary (`items` / `categories` / `data` / bare array).
4. **Client components** use `src/lib/api.ts` functions via TanStack Query (staleTime 5 min, gc 10 min).
5. **Types**: `src/types/api.d.ts` generated from the backend Swagger (`pnpm gen:types`).

## Client State

- **TanStack Query** — server state (auth user, categories, jobs, bookings). Provider in `src/components/Providers.tsx`.
- **AuthContext** (`src/context/AuthContext.tsx`) — thin wrapper exposing `useAuth()` (user, isLoading, login, logout) over the query hooks; mounted in `ClientProviders`.
- **React Context** — theme (`next-themes`).
- **sessionStorage draft** — onboarding profile-setup state (`bw:onboarding:draft`), cleared on submit.

Provider tree (root layout): `ClientProviders` → `Providers` (QueryClient) → `AppRouterCacheProvider` (MUI/Emotion) → `AuthProvider` → `ThemeProvider`.

## Realtime & Media

- **SSE** (`/api/sse`): short-lived serverless streams (~20s) with EventSource auto-reconnect for dashboard live updates.
- **Uploads**: Cloudinary folders (`user-profiles`, `user-services`, `user-jobs`, `user-videos`, `service-categories`) via `/api/uploads/*`.
- **Payments**: backend creates the Monnify intent; frontend redirects to `https://checkout.monnify.com/{reference}`.
- **Notifications**: native browser `Notification` API (not FCM).

## Deployment

- **Vercel** (SSR + API routes + image optimization; static export removed).
- Env vars: see `docs/setup.md`.
- Gates: `pnpm build` (type-check + routes), `pnpm lint` (0 errors), `pnpm test`, `pnpm test:e2e`.
- `prebuild` runs `rimraf .next` to avoid stale Turbopack cache crashes.
- `.github/workflows/nextjs.yml` is a stale GitHub Pages workflow (static `./out` deploy) that predates Vercel — it no longer matches the build; see `docs/conventions.md`.
