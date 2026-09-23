# BaroqueWorks Frontend

A Next.js 16 marketplace frontend connecting clients with local trade professionals (electricians, plumbers, carpenters, painters, etc.) across Nigeria.

**Tech Stack:**
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · MUI v7 · Formik + Yup · TanStack Query · Mapbox GL · Framer Motion · Vitest + Playwright

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/digilands/baroque-works-frontend.git
cd baroque-works-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values (see docs/setup.md)

# Run development server
pnpm dev
```

The app runs at `http://localhost:3000`. A running NestJS backend is required for authentication features — see [docs/setup.md](docs/setup.md) for details.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:watch` | Run unit tests in watch mode |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm gen:types` | Regenerate `src/types/api.d.ts` from Swagger |
| `pnpm make` | Scaffold UI components, utils, or pages |

## Project Structure

```
src/
  app/           # Pages and layouts (App Router)
    (pages)/     # Landing, search, services, jobs, bookings, profiles
    auth/        # Login, signup, profile setup, onboarding
    dashboard/   # Client and handyman dashboards
    admin/       # Admin overview and catalog manager
    api/         # BFF API routes (proxy to NestJS backend)
  components/    # Feature components (landing, dashboard, admin)
  context/       # Auth context (wraps TanStack Query hooks)
  contexts/      # Theme provider
  hooks/         # Client data hooks (useAuth, useMarketplace, ...)
  lib/           # Axios instances, BFF proxy, server queries, auth
  proxy.ts       # Route protection middleware (Next 16)
  types/         # TypeScript interfaces (incl. generated api.d.ts)
  utils/         # Utilities and static data
e2e/             # Playwright end-to-end tests
```

## Documentation

- [Architecture](docs/architecture.md) — Stack, rendering strategy, auth flow, BFF/data layer, route protection, deployment
- [Setup](docs/setup.md) — Install, env vars, development, build, scaffolding, troubleshooting
- [Conventions](docs/conventions.md) — Naming, RSC split, state, forms, styling, onboarding draft, testing, git/CI
- [API Routes](docs/api-routes.md) — All 36 Next.js Route Handlers grouped by domain
- [Testing](docs/testing.md) — Vitest unit tests and Playwright E2E: setup, coverage, writing tests

## License

Apache-2.0
