# BaroqueWorks Frontend

A Next.js 15 marketplace frontend connecting clients with local trade professionals (electricians, plumbers, carpenters, painters, etc.) across Nigeria.

**Tech Stack:**
Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · MUI v7 · Formik + Yup · Framer Motion

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
| `pnpm make` | Scaffold UI components, utils, or pages |

## Project Structure

```
src/
  app/           # Pages and layouts (App Router)
    (pages)/     # Service browsing, detail, review
    auth/        # Login, signup, profile setup
    dashboard/   # Handyman dashboard
    api/         # BFF API routes (proxy to NestJS backend)
  components/    # Feature components (landing, dashboard)
  context/       # Auth context
  contexts/      # Theme provider
  lib/           # Axios instances and auth types
  types/         # TypeScript interfaces
  utils/         # Utilities and mock data
```

## Documentation

- [Architecture](docs/architecture.md) — Route groups, auth flow, API proxy pattern, deployment
- [Setup](docs/setup.md) — Install, env vars, development, build, scaffolding
- [Conventions](docs/conventions.md) — Naming, patterns, styling, error handling
- [API Routes](docs/api-routes.md) — All Next.js Route Handlers with inputs and behavior

## License

Apache-2.0
