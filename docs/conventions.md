# Conventions

## File & Folder Naming

| Location         | Convention | Example                                 |
| ---------------- | ---------- | --------------------------------------- |
| Route folders    | kebab-case | `services/[id]/`, `profilesetup/`       |
| React components | PascalCase | `HeroSection.tsx`, `BookingSidebar.tsx` |
| Utility files    | camelCase  | `cn.ts`, `data.ts`                      |
| Type files       | camelCase  | `job.ts`                                |
| Context files    | PascalCase | `AuthContext.tsx`, `ThemeProvider.tsx`  |

## Component Patterns

- **All components are client-rendered** (`"use client"` directive) — the app does not leverage React Server Components for page content
- **Functional components only** — no class components except `ErrorBoundary`
- **Named exports** for UI components, **default exports** for page/layout components
- Props interfaces are defined above the component in the same file
- Component files are co-located: pages live in `src/app/`, shared UI in `src/app/ui/`, feature components in `src/components/`

## State Management

- **React Context** for global state (auth, theme)
- **Local `useState`** for component-level state
- **No Redux, Zustand, or other state libraries**

## Forms

- **Formik** for form state management and submission
- **Yup** for validation schemas
- Form components use `useField` from Formik (see `TextInput`, `SelectInput`)

## Error Handling

- **ErrorBoundary** class component wraps major dashboard sections (stats, charts, widgets)
- **try/catch** with `console.error` in API routes and auth context
- **notFound()** from `next/navigation` for missing resources
- **Loading states**: `loading.tsx` files in route segments for Suspense boundaries, plus `Skeleton` and `*Skeletons` components
- **Suspense** wraps async dashboard widgets with fallback skeletons

## Styling

- **Tailwind CSS v4** with CSS-first configuration in `globals.css`
- **Theme tokens** defined via `@theme` in CSS (not `tailwind.config.ts`):
  - `--color-bg`, `--color-text`, `--color-gold`, etc.
  - Dark mode via `.dark` class selector
- **MUI** used selectively for Dialog/Modal components (`@mui/material`)
- **Emotion** for MUI CSS-in-JS caching (`@emotion/cache`, `@mui/material-nextjs`)
- **Framer Motion** for page-level animations (hero, landing sections)
- **keen-slider** for horizontal service carousels
- **Swiper** for the vertical carousel on signup page
- Custom font: SF Pro Display (loaded via `@font-face`), Poppins + Geist (loaded via `next/font/google`)

## Icon Libraries

- **Hugeicons** (`@hugeicons/react` + `@hugeicons/core-free-icons`) — primary icon set
- **Lucide React** — used in job detail page components
- Icons are imported individually (tree-shakeable)

## API Communication

- Two Axios instances in `src/lib/auth.ts`:
  - `internalApi` (client-side): calls `/api/*` routes
  - `backendApi` (server-side in Route Handlers): calls NodeJS backend
- All API calls wrapped in try/catch with error forwarding

## Git/CI

- GitHub Actions on push to `main` or `dev`
- Builds and deploys to GitHub Pages
- pnpm for dependency management
- No pre-commit hooks configured
