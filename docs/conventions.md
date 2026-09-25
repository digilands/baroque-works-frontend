# Conventions

## File & Folder Naming

| Location            | Convention  | Example                                  |
| ------------------- | ----------- | ---------------------------------------- |
| Route folders       | kebab-case  | `services/[id]/`, `role-selection/`      |
| React components    | PascalCase  | `HeroSection.tsx`, `LocationPicker.tsx`  |
| Utility files       | camelCase   | `cn.ts`, `api-proxy.ts`                  |
| Hooks               | camelCase   | `useOnboarding.ts`, `useGeolocation.ts`  |
| Type files          | camelCase   | `job.ts`, `api.d.ts`                     |
| Context files       | PascalCase  | `ThemeProvider.tsx`                      |
| Route handlers      | `route.ts`  | `src/app/api/auth/login/route.ts`        |
| Tests               | `*.test.ts` | `queries.test.ts` (colocated)            |

## Rendering Split

- **Server Components** for pages that only need data: landing, home feed, service detail, dashboard entry gate, admin shell. They use `src/lib/server/queries.ts` (marked `server-only`) and often `export const dynamic = "force-dynamic"`.
- **Client Components** (`"use client"`) for interactivity: auth/onboarding forms, booking modals, map pickers, dashboards widgets, admin forms.
- Prefer pushing data fetching to the server; keep client components receiving props or using TanStack Query.

## State Management

- **TanStack Query** for server state from the browser (staleTime 5 min, gcTime 10 min). Query keys are arrays like `['user']`, `['onboarding', 'categories']`. Provided by `src/components/Providers.tsx`.
- **AuthContext** (`src/context/AuthContext.tsx`) is a thin wrapper over the query hooks (`useUser`/`useLogin`/`useLogout`) exposed as `useAuth()` — used by Navbar, Sidebar, Header, ProfileMenu, login/admin-login pages. Mounted in `ClientProviders`. Underlying state still lives in the `['user']` query.
- **Theme Context** via `next-themes` (`src/contexts/ThemeProvider.tsx`).
- **Local `useState`** for component state; **sessionStorage draft** (`bw:onboarding:draft`) for multi-step onboarding persistence.
- No Redux/Zustand.

## Forms

- **Formik** + **Yup** validation. Shared inputs (`TextInput`, `SelectInput`) use `useField`.
- Per-category experience levels are native `<select>`s bound to component state, not Formik fields.
- Draft persistence uses a debounced `AutoPersist` child inside `<Formik>` via `useFormikContext` — never call `setState` in a render body or sync effect (lint: `react-hooks/set-state-in-effect`).

## Error Handling

- **`ApiError` + `toApiError`** (`src/lib/api-errors.ts`) normalize Axios/backend failures everywhere.
- **BFF**: `proxyGet/Post/...` catch and return `{ success: false, message }` with the backend status.
- **Pages**: `error.tsx` boundaries per route segment; `ErrorBoundary` class component wraps legacy dashboard widgets.
- **`notFound()`** from `next/navigation` for missing resources.
- **Loading**: `loading.tsx` segments + `Skeleton`/`*Skeletons` components; Suspense around async widgets.

## API Communication

Two Axios instances in `src/lib/auth.ts`:

- **`internalApi`** (browser): `baseURL: '/api'`; response interceptor refreshes once on 401 (single-flight, skips `/auth/login|signup|refresh`).
- **`backendApi`** (server): `baseURL: NEXT_PUBLIC_API_URL`; used by BFF handlers and `lib/server/backend.ts`.

Client data access goes through `src/lib/api.ts` functions wrapped by TanStack Query hooks. Server pages use `lib/server/queries.ts`. Never call the backend directly from client components.

## Styling

- **Tailwind CSS v4** with CSS-first config in `globals.css` (`@theme` tokens: `--color-bg`, `--color-text`, `--color-gold`, …). Dark mode via `.dark` class.
- **MUI v7** selectively for dialogs/modals; **Emotion** for MUI caching (`@mui/material-nextjs`).
- **Framer Motion** for page-level animation; **keen-slider** (home carousel), **Swiper** (signup).
- Fonts: SF Pro Display (`@font-face`), Poppins + Geist (`next/font/google`).

## Maps

- `MapboxMap` and `LocationPicker` in `src/components/ui/`. Must load with `ssr: false` (uses `window`).
- Custom pin image: `/handyman-logo.svg`. Token: `NEXT_PUBLIC_MAPBOX_TOKEN`.

## Icons

- **Hugeicons** (`@hugeicons/react` + `@hugeicons/core-free-icons`) — primary, imported individually.
- **Lucide React** — secondary (job detail components).

## Onboarding Draft

- Key: `bw:onboarding:draft` (sessionStorage) with helpers `loadDraft` / `saveDraft` / `clearDraft` exported from `src/app/auth/serviceselection/page.tsx`.
- Stores `categoryIds`, per-category `experiences`, `avatar`, `picked` location, `stateName`, `lga`, and Formik fields. Cleared only on successful submit.

## Types

- Backend contract types come from generated `src/types/api.d.ts` (`components["schemas"][...]`), re-exported as `ApiUser`, `ApiJob`, etc. in `lib/server/queries.ts`.
- View-model types (formatted for display) live in `src/types/job.ts` and `lib/server/mappers.ts` (`formatNaira`, `formatDate`, `initials`, …).
- Regenerate with `pnpm gen:types` after backend Swagger changes.

## Testing

- Unit tests colocate next to source (`foo.ts` → `foo.test.ts`), Vitest + Testing Library.
- E2E specs live in `e2e/*.spec.ts` (Playwright). Mock `server-only` in unit tests that import `lib/server/*`.

## Git/CI

- Branches: `main` (production) and `dev` (integration) on `origin`.
- **Deploy target: Vercel** (SSR + API routes; static export was removed).
- `.github/workflows/nextjs.yml` still exists but is **stale** — it builds a static `./out` for GitHub Pages, which no longer matches this app (no `output: 'export'`, and Pages deploys would break the BFF routes). Treat as legacy; remove or replace when convenient.
- pnpm for dependencies. No pre-commit hooks.
- Lint gate: 0 errors (warnings tolerated). Build gate: `pnpm build` must pass.
