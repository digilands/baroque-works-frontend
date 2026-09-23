# Setup

## Prerequisites

- Node.js 20+
- pnpm
- A running NestJS backend (see [Required Backend](#required-backend))

## Install

```bash
git clone https://github.com/digilands/baroque-works-frontend.git
cd baroque-works-frontend
pnpm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable                   | Description                                             | Default                                                    |
| -------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_API_URL`      | Backend base URL — **required**; missing causes loopbacks | `https://baroque-works-backend.onrender.com/api/v1`         |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token (maps, geocoding, location picker)  | —                                                          |
| `GOOGLE_WEB_CLIENT_ID`     | Google OAuth client ID                                  | —                                                          |
| `GOOGLE_WEB_CLIENT_SECRET` | Google OAuth client secret                              | —                                                          |
| `GOOGLE_WEB_REDIRECT_URI`  | Google OAuth redirect URI                               | `http://localhost:3000/api/auth/google/callback`           |

> `NEXT_PUBLIC_API_URL` must be set. Without it, server backend calls loop back to this app (HTML 404s or self-recursion) — `src/lib/server/backend.ts` logs a loud warning on first miss.

## Commands

| Command            | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `pnpm dev`         | Dev server at `http://localhost:3000` (Turbopack)        |
| `pnpm build`       | Production build (`prebuild` clears `.next` first)       |
| `pnpm start`       | Run the production build                                 |
| `pnpm lint`        | ESLint 9 flat config (`eslint.config.mjs`)               |
| `pnpm test`        | Vitest unit tests (jsdom, `src/**/*.test.ts(x)`)         |
| `pnpm test:watch`  | Vitest watch mode                                        |
| `pnpm test:e2e`    | Playwright E2E (`e2e/`, boots `pnpm dev`)                |
| `pnpm gen:types`   | Regenerate `src/types/api.d.ts` from `context/swagger.yaml` |
| `pnpm make`        | Interactive scaffolder (components, utils, pages)        |

## Testing

- **Unit** (Vitest): colocated `*.test.ts` under `src/`; setup at `src/test/setup.ts`.
- **E2E** (Playwright): specs in `e2e/`; `global-setup.ts` warms the backend (Render cold starts). Runs against `http://localhost:3000` (`PLAYWRIGHT_BASE_URL` overrides).

See [docs/testing.md](testing.md).

## Scaffolding

```bash
pnpm make
```

Generates:

- UI Component → `src/app/ui/<Name>.tsx`
- Utility Function → `src/utils/<name>.ts`
- Page → `src/app/<name>/page.tsx`

## Required Backend

This frontend requires the NestJS backend at `NEXT_PUBLIC_API_URL`. The backend handles authentication, users, categories, jobs, services, bookings, disputes, uploads, and payments. Swagger source lives in `context/swagger.yaml`.

Without the backend the app still renders, but data pages show empty/error states and auth flows fail.

## Troubleshooting

- **Turbopack "Cache corruption" / compaction errors**: delete `.next` and `node_modules/.cache`, then rerun `pnpm dev`.
- **Backend calls return HTML/404 or loop**: `NEXT_PUBLIC_API_URL` is unset — fix `.env.local`.
- **Stale `.next` type-check crashes on build**: already handled by `prebuild` (`rimraf .next`).
