# Setup

## Prerequisites

- Node.js 20+
- pnpm (package manager)

## Install

```bash
git clone https://github.com/digilands/baroque-works-frontend.git
cd baroque-works-frontend
pnpm install
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Description | Default |
|----------|-------------|---------|
| `GOOGLE_WEB_CLIENT_ID` | Google OAuth client ID | — |
| `GOOGLE_WEB_CLIENT_SECRET` | Google OAuth client secret | — |
| `GOOGLE_WEB_REDIRECT_URI` | Google OAuth redirect URI | `http://localhost:3000/api/auth/callback/google` |
| `NEXT_PUBLIC_API_URL` | NestJS backend URL (used by login page for Google redirect) | `http://localhost:8000` |

The backend URL used by API route handlers is also `NEXT_PUBLIC_API_URL` (set in `src/lib/auth.ts`).

## Development

```bash
pnpm dev
```

Runs at `http://localhost:3000`.

## Build & Start

```bash
pnpm build
pnpm start
```

## Lint

```bash
pnpm lint
```

Uses ESLint 9 with flat config (`eslint.config.mjs`). Extends `next/core-web-vitals` and `next/typescript`.

## Scaffolding

```bash
pnpm make
```

Interactive CLI to generate:
- UI Component → `src/app/ui/<Name>.tsx`
- Utility Function → `src/utils/<name>.ts`
- Page → `src/app/<name>/page.tsx`

## Required Backend

This frontend requires a running NestJS backend at `NEXT_PUBLIC_API_URL`. The backend handles:
- Authentication (login, signup, Google OAuth)
- User management
- Service/job data

Without the backend, the app runs but login/signup will fail. Mock data in `src/utils/data.ts` is used for the service browsing UI.
