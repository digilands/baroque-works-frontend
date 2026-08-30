# Architecture

## Overview

BaroqueWorks is a Next.js 15 App Router application that serves as the frontend for a handyman services marketplace. It connects clients with local trade professionals (electricians, plumbers, carpenters, etc.) across Nigeria.

The frontend is a **client-rendered** application that communicates with an external **NestJS backend** via a BFF (Backend for Frontend) pattern using Next.js API Routes.

## Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Framework       | Next.js 15 (App Router)                     |
| UI Library      | React 19                                    |
| Language        | TypeScript (strict mode)                    |
| Styling         | Tailwind CSS v4 (CSS-first config) + MUI v7 |
| Forms           | Formik + Yup                                |
| HTTP            | Axios (two instances)                       |
| Auth            | JWT (HTTP-only cookies) + Google OAuth      |
| Animation       | Framer Motion, CSS animations               |
| Charts          | Recharts                                    |
| Icons           | Hugeicons, Lucide React                     |
| Theming         | next-themes (class-based dark mode)         |
| Package Manager | pnpm                                        |

## Directory Structure

```
src/
  app/                    # Next.js App Router pages
    layout.tsx            # Root layout (providers wrap)
    page.tsx              # Landing page (/)
    globals.css           # Tailwind + theme tokens
    (pages)/              # Route group (no URL segment)
      layout.tsx          # Pages layout with Header
      home/               # /home — service browsing
      services/[id]/      # /services/:id — service detail + booking
      review/             # /review — post-service review
    auth/                 # /auth/* — authentication flow
      login/              # /auth/login
      signup/             # /auth/signup
      profilesetup/       # /auth/profilesetup
      serviceselection/   # /auth/serviceselection
    dashboard/            # /dashboard — handyman dashboard
      layout.tsx          # Dashboard layout (sidebar + header)
      page.tsx            # /dashboard — overview
      jobs/               # /dashboard/jobs — job requests
        [id]/             # /dashboard/jobs/:id — job detail
    api/                  # Next.js API Routes (BFF)
      auth/
        login/route.ts
        signup/route.ts
        logout/route.ts
        me/route.ts
        google/callback/route.ts
    ui/                   # Shared UI components
      jobs/               # Job detail page components
      dashboard/          # Dashboard UI shell
      modals/             # Booking flow modals
  components/
    landing/              # Landing page components
    dashboard/            # Dashboard components (sidebar, header, widgets)
    ErrorBoundary.tsx     # Class-based error boundary
  context/
    AuthContext.tsx        # Authentication state + methods
  contexts/
    ThemeProvider.tsx      # Dark/light theme wrapper
  lib/
    auth.ts               # Axios instances + auth types
  types/
    job.ts                # JobRequest, Client, Financials types
  utils/
    cn.ts                 # Classname helper
    data.ts               # Mock data (services, handymen, states)
```

## Route Groups

### Landing (`/`)

- `src/app/page.tsx` — Hero section, popular categories, trust section, footer
- All client-rendered with Framer Motion animations

### Pages (`/(pages)/`)

- Wrapped by a layout with the `Header` component (search bar, location selector, notifications)
- **Home** (`/home`): Services carousel (keen-slider) + filterable grid of handymen
- **Service Detail** (`/services/[id]`): Gallery, handyman profile, about section, reviews, location map, and a multi-step booking flow (Schedule → Confirm → Payment modals using MUI Dialog)
- **Review** (`/review`): Star rating, tag selection, text review, photo upload

### Auth (`/auth/`)

- Login with email/password + Google OAuth redirect
- Signup with Formik form → redirects to login on success
- Service selection (post-signup) → Profile setup (Formik + Yup) → Dashboard redirect
- Middleware at `src/middleware.ts` redirects logged-in users away from auth pages

### Dashboard (`/dashboard`)

- Sidebar navigation + header with notifications modal
- Overview: stats cards, insights bar chart (Recharts), schedule widget, upcoming job, reviews, messages
- Jobs list with tab filtering (all/pending/active/completed)
- Job detail: server component with `async getJobRequest()`, renders task overview, client card, location, schedule/payment, accept/decline actions

## Authentication Flow

```
Client                Next.js API Routes         Nodejs Backend
  |                          |                          |
  |-- POST /api/auth/login ->|                          |
  |                          |-- POST /auth/login ----->|
  |                          |<-- { token, user } ------|
  |                          |-- Set cookies ---------->|
  |<-- { success, user } ---|                          |
  |                          |                          |
  |-- GET /api/auth/me ----->|                          |
  |                          |-- GET /auth/me --------->|
  |                          |<-- { user } -------------|
  |<-- { user } ------------|                          |
```

### Cookie Management

- `accessToken`: HTTP-only, secure, 7-day expiry, sameSite strict
- `refreshToken`: HTTP-only, secure, 30-day expiry, sameSite strict
- Set by API routes via `next/headers` cookies API
- Cleared on logout

### Google OAuth

- Frontend redirects to `NEXT_PUBLIC_API_URL/auth/google`
- Backend processes OAuth, redirects to `/api/auth/google/callback?token=...`
- Callback route extracts token from query params and sets cookies

## API Proxy Pattern

The app uses two Axios instances defined in `src/lib/auth.ts`:

1. **`internalApi`** (client-side): `baseURL: '/api'` — calls Next.js Route Handlers
2. **`backendApi`** (server-side, in Route Handlers): `baseURL: NEXT_PUBLIC_API_URL` — calls the NestJS backend

This keeps the backend URL server-side only and allows Next.js API Routes to act as a secure proxy.

## Middleware

`src/middleware.ts` runs on matched routes (`/dashboard/:path*`, `/auth/:path*`):

- If user has `accessToken` and visits an auth page → redirect to `/dashboard`
- Protected dashboard routes are currently commented out (available for future use)

## Static Data

Mock data lives in `src/utils/data.ts`:

- `services`: Array of service categories with images and sub-sections
- `handymen`: Array of handyman profiles with ratings, reviews, offered services
- `nigerianStates`: List of Nigerian states for the location selector

This data is used for development/demo purposes. Production would fetch from the NestJS backend.

## Deployment

- GitHub Actions CI/CD on push to `main` or `dev`
- Builds Next.js as a static export (`next build` → `out/`)
- Deploys to GitHub Pages via `actions/deploy-pages@v4`
- Node 20, pnpm detected automatically
