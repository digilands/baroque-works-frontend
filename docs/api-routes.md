# API Routes

All routes are Next.js Route Handlers under `src/app/api/`. They form a **BFF (Backend for Frontend)** proxy: the browser calls `/api/*`, the handler forwards to the NestJS backend at `NEXT_PUBLIC_API_URL`, attaching `Authorization: Bearer <accessToken cookie>` and managing session cookies.

**Implementation pattern:** most routes are one-liners over `src/lib/api-proxy.ts` (`proxyGet/Post/Put/Patch/Delete/MultipartPost`), which call `src/lib/server/backend.ts`. Query params are forwarded automatically. Errors return `{ success: false, message }` with the backend's status code.

**Contract source:** backend Swagger at `context/swagger.yaml` → generated `src/types/api.d.ts`.

## Auth (`/api/auth`)

| Method | Route | Purpose | Notes |
| ------ | ----- | ------- | ----- |
| POST | `/api/auth/login` | Email/password login | Sets `accessToken` (7d) + `refreshToken` (30d) HTTP-only cookies. Body: `{ email, password }`. Returns `{ success, user }`. |
| POST | `/api/auth/signup` | Register | Backend returns tokens in JSON body (sets no cookies) — this route sets both cookies itself. Body: `{ fullname, email, password, role? }` (role lowercase `client`/`handyman`, optional). Fresh signup lands authenticated → `/auth/role-selection`. |
| POST | `/api/auth/refresh` | Rotate session | Reads `refreshToken` cookie → `POST /auth/refresh` → rewrites both cookies. Called by the client's single-flight 401 interceptor. |
| POST | `/api/auth/logout` | End session | Clears both cookies (no backend call). |
| GET | `/api/auth/me` | Current user | Cookie → `GET /auth/me`. Returns `{ user }` or 401. |
| GET | `/api/auth/google/callback` | OAuth redirect target | Query `?token=&refreshToken?` → sets cookies → fetches `/auth/me` + profile with the fresh token → redirects to role/profile-aware destination (login / role-selection / serviceselection / onboarding/client / dashboard / admin). |
| PUT | `/api/auth/password-reset` | Reset password | Proxies `PUT /auth/password-reset`. |

## Categories (`/api/categories`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/categories` | Service categories (`?isActive`). |
| GET | `/api/categories/subcategories` | Subcategories (`?categoryId&isActive`). |
| GET | `/api/categories/tags` | Tags (`?category&isActive`). |

> Envelope note: backend list responses vary (`items` / `categories` / `data` / bare array). Server queries normalize via `asArray()`; client fetchers try each key.

## Handymen (`/api/handymen`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/handymen` | Geospatial search (`?cursor&limit&categoryId&experienceLevel&rating&latitude&longitude&radius`). |
| GET | `/api/handymen/[id]` | Profile detail (public). |
| POST | `/api/handymen` | Create own handyman profile (onboarding). Body: `{ categoryId: [{ type, experienceLevel }], location?, tags? }`. |
| PATCH | `/api/handymen/me` | Update own handyman profile (proxies `PATCH /handymen`). |

## Hirers (`/api/hirers`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| POST | `/api/hirers` | Create own hirer profile (client onboarding). |

## Users (`/api/users`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/users` | Paginated user list, admin (`?nextCursor&limit&role`). |
| PUT | `/api/users/me` | Update own record (phone, avatar, bio, address, fullname). Resolves user id via `/auth/me`, proxies `PUT /users/{id}`. **Side effect:** if the backend rotates tokens (e.g. role change), cookies are rewritten server-side; tokens are stripped before responding to the browser. |

## Jobs (`/api/jobs`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/jobs` | Listings + filters + geo search (`?category&urgency&status&minBudget&maxBudget&latitude&longitude&radius&limit&cursor`). |
| POST | `/api/jobs` | Create job posting (hirer). |
| GET | `/api/jobs/[id]` | Job detail. |
| PATCH | `/api/jobs/[id]` | Update job (owner). |
| DELETE | `/api/jobs/[id]` | Cancel/delete job (owner). |

## Services (`/api/services`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/services` | Service feed/list. |
| POST | `/api/services` | Create service (handyman). |
| GET | `/api/services/[id]` | Service detail. |
| PUT | `/api/services/[id]` | Update service (owner). |
| DELETE | `/api/services/[id]` | Delete service (owner). |

## Bookings (`/api/bookings`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/bookings` | Current user's bookings (`?status&bookingSource&paymentStatus&hirerId&handymanId&limit&cursor`). |
| POST | `/api/bookings` | Accept a bid: proxied to `POST /bookings/job`. Body: `{ jobId, handymanId, scheduledDate?, totalAmount? }`. |
| GET | `/api/bookings/[id]` | Booking detail. |
| PATCH | `/api/bookings/[id]/status` | Role-aware status transitions (confirm/start/complete/cancel). |
| POST | `/api/bookings/service` | Book directly from a service listing (Hire flow). |

## Disputes (`/api/disputes`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| POST | `/api/disputes` | Open a dispute. |
| GET | `/api/disputes/[id]` | Dispute detail. |

## Uploads (`/api/uploads`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| POST | `/api/uploads/image` | Single image (multipart) → Cloudinary. |
| POST | `/api/uploads/images` | Up to 10 images (multipart: `files[]`, `folder?`). |
| DELETE | `/api/uploads/[...publicId]` | Delete asset by public id. |

Cloudinary folders: `user-profiles`, `user-services`, `user-jobs`, `user-videos`, `service-categories`.

## Admin Catalog (`/api/admin`)

All writes are admin-only at the backend. List endpoints proxy the public reads.

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET/POST | `/api/admin/categories` | List (public read) / create. |
| PUT/DELETE | `/api/admin/categories/[id]` | Update / delete. |
| GET/POST | `/api/admin/subcategories` | List (`?categoryId`) / create. |
| PUT/DELETE | `/api/admin/subcategories/[id]` | Update / delete. |
| GET/POST | `/api/admin/tags` | List (`?category`) / create. |
| PUT/DELETE | `/api/admin/tags/[id]` | Update / delete. |

## Realtime (`/api/sse`)

| Method | Route | Purpose |
| ------ | ----- | ------- |
| GET | `/api/sse?channel=bookings\|jobs` | **Server-Sent Events.** Sends one backend snapshot + 4 heartbeats over ~20s, then closes (Vercel can't hold streams open). `EventSource` auto-reconnects, giving near-live dashboard updates. Always `force-dynamic`. |

## Conventions

- Session tokens never reach browser JavaScript — cookies only.
- Dynamic segments are read from `request.nextUrl.params` / path and re-encoded before the backend call.
- Anything nontrivial (login, signup, refresh, OAuth callback, `users/me`) handles cookies explicitly with `next/headers`.
- Adding a route: prefer a `proxy*` one-liner; only hand-roll when cookies or response shaping are involved.
