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

For Cloudflare builds, provide the `NEXT_PUBLIC_*` variables in the build environment because Next.js embeds them into the client bundle. Keep `GOOGLE_WEB_CLIENT_SECRET` in a secret store; do not commit secrets or `.dev.vars`.

## Commands

| Command            | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `pnpm dev`         | Dev server at `http://localhost:3000` (Turbopack)        |
| `pnpm build`       | Production build (`prebuild` clears `.next` first)       |
| `pnpm preview`     | Build with OpenNext and preview the Worker in Wrangler   |
| `pnpm deploy`      | Build with OpenNext and deploy to Cloudflare Workers     |
| `pnpm upload`      | Build with OpenNext and upload the Worker                |
| `pnpm cf-typegen`  | Generate types from the Wrangler environment             |
| `pnpm start`       | Run the Next.js production build                         |
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

## Cloudflare Workers

The project is configured for Cloudflare Workers using `@opennextjs/cloudflare`. `wrangler.jsonc` defines the Worker (`handyman`), static assets, image optimization binding, and self-reference service; `open-next.config.ts` contains the adapter configuration. `next.config.ts` initializes the Cloudflare platform proxy for local development.

```bash
# Preview the production-style Worker locally
pnpm preview

# Deploy to the Cloudflare account authenticated with Wrangler
pnpm deploy

# Generate Cloudflare binding types when configuration changes
pnpm cf-typegen
```

Set the `NEXT_PUBLIC_*` build variables before running the build/deploy commands. Configure server-only production secrets in Cloudflare; for example, use `pnpm exec wrangler secret put GOOGLE_WEB_CLIENT_SECRET`. Set the production `GOOGLE_WEB_REDIRECT_URI` to the deployed app's `/api/auth/google/callback` URL. Local Wrangler development uses `.dev.vars`; this file is local-only and must not be committed.

The migration has **not** configured an incremental cache. The migrator reported that cache setup is still required; review the [OpenNext Cloudflare caching guide](https://opennext.js.org/cloudflare/caching) and configure the required bindings before production use. The generated config currently leaves the example R2 cache commented out.

OpenNext warns that Windows is not fully supported and recommends WSL. The first `pnpm preview` attempt on Windows built the Next.js application and passed TypeScript checks, but failed while bundling middleware because Windows denied creation of a symlink (`EPERM`). OpenNext also warns that Node.js middleware support on Cloudflare is experimental; this app uses Next.js `src/proxy.ts` for route protection. Additionally, the installed adapter declares peer support for Next.js `>=15.5.28 <16 || >=16.4.1`, while this project currently uses Next.js `16.3.5`; resolve that version mismatch before treating Cloudflare deployment as validated.

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
