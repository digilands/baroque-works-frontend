# API Routes

All routes are Next.js Route Handlers under `src/app/api/`. They act as a BFF (Backend for Frontend) proxy, forwarding requests to the NodeJS backend and managing cookies.

## POST `/api/auth/login`

**Purpose:** Authenticate a user with email/password.

**Request body:**

```json
{ "email": "string", "password": "string" }
```

**Backend call:** `POST /auth/login` on `NEXT_PUBLIC_API_URL`

**Response (success):**

```json
{ "success": true, "user": { "_id", "email", "fullname", "role", "avatar" } }
```

**Side effects:** Sets `accessToken` (7 days) and optionally `refreshToken` (30 days) as HTTP-only cookies.

**Error:** Returns the backend's error message and status code, or 500 on network failure.

**File:** `src/app/api/auth/login/route.ts`

---

## POST `/api/auth/signup`

**Purpose:** Register a new user account.

**Request body:**

```json
{ "fullname": "string", "email": "string", "password": "string", "role": "Client" | "Handyman" }
```

**Backend call:** `POST /auth/signup` on `NEXT_PUBLIC_API_URL`

**Response (success):**

```json
{ "success": true, "data": { ... } }
```

**Side effects:** None (user must log in separately after signup).

**File:** `src/app/api/auth/signup/route.ts`

---

## POST `/api/auth/logout`

**Purpose:** End the user session by clearing cookies.

**Request body:** None

**Backend call:** None (cookie clearing only)

**Response:**

```json
{ "success": true, "message": "Logged out successfully" }
```

**Side effects:** Deletes `accessToken` and `refreshToken` cookies.

**File:** `src/app/api/auth/logout/route.ts`

---

## GET `/api/auth/me`

**Purpose:** Get the current authenticated user's profile.

**Request body:** None (reads `accessToken` from cookies)

**Backend call:** `GET /auth/me` with `Authorization: Bearer <token>` header

**Response (success):**

```json
{ "user": { "_id", "email", "fullname", "role", "avatar" } }
```

**Response (no token):**

```json
{ "user": null }
```

Status: 401

**File:** `src/app/api/auth/me/route.ts`

---

## GET `/api/auth/google/callback`

**Purpose:** Handle the OAuth redirect from Google (via the NodeJs backend). Extracts the token from query parameters and sets cookies.

**Query parameters:**

- `token` (required) — JWT access token
- `refreshToken` (optional) — refresh token

**Response:** Redirects to `/dashboard`

**Side effects:** Sets `accessToken` and optionally `refreshToken` as HTTP-only cookies.

**Error:** Redirects to `/auth/login?error=oauth_failed` if no token is present.

**File:** `src/app/api/auth/google/callback/route.ts`
