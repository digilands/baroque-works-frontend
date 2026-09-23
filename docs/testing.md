# Testing

Two layers: **Vitest** for unit tests, **Playwright** for end-to-end.

## Unit Tests (Vitest)

```bash
pnpm test        # single run
pnpm test:watch  # watch mode
```

- **Config:** `vitest.config.ts` — jsdom environment, React plugin, `@` → `src` alias, globals enabled.
- **Setup:** `src/test/setup.ts` (Testing Library jest-dom matchers).
- **Location:** colocated next to source: `foo.ts` → `foo.test.ts` under `src/` (excludes `e2e/`).

### What's covered (38 tests / 7 files)

| File | Covers |
| ---- | ------ |
| `src/lib/server/queries.test.ts` | `asArray()` envelope normalization (backend list responses vary) |
| `src/lib/server/auth-redirect.test.ts` | `resolvePostAuthDestination()` — role/profile-aware post-auth routing |
| `src/lib/server/mappers.test.ts` | Formatters (`formatNaira`, `formatDate`, `initials`, …) |
| `src/lib/api-errors.test.ts` | `toApiError` normalization |
| `src/lib/monnify.test.ts` | Payment intent helpers |
| `src/hooks/useGeolocation.test.ts` | Geolocation hook |
| `src/utils/cn.test.ts` | Classname helper |

### Writing a unit test

```ts
// src/lib/foo.test.ts
import { describe, it, expect } from "vitest";
import { myFn } from "./foo";

describe("myFn", () => {
  it("handles the happy path", () => {
    expect(myFn(1)).toBe(2);
  });
});
```

**Importing `lib/server/*`:** those modules import `server-only` (a runtime error in jsdom). Mock it first:

```ts
vi.mock("server-only", () => ({}));
```

See `src/lib/server/auth-redirect.test.ts` for mocking sibling server modules with `vi.mock`.

## E2E Tests (Playwright)

```bash
pnpm test:e2e
```

- **Config:** `playwright.config.ts` — `testDir: ./e2e`, Chromium only, boots `pnpm dev` automatically (`reuseExistingServer` locally), HTML reporter, traces on first retry.
- **Global setup:** `e2e/global-setup.ts` — warms the backend before tests (Render cold starts would otherwise cause first-request timeouts).
- **Base URL:** `http://localhost:3000` (override with `PLAYWRIGHT_BASE_URL`).
- **CI:** 2 retries, 1 worker, `forbidOnly`.

### What's covered (12 tests / 2 files)

| File | Covers |
| ---- | ------ |
| `e2e/guest.spec.ts` | Anonymous browsing: landing hero, home services section, search page, service-detail → login redirect, role-selection page |
| `e2e/auth.spec.ts` | Auth gates: `/dashboard`, `/dashboard/jobs`, new protected pages, `/admin` → admin login; login rejects bad credentials; signup validates email; admin login rejects non-admin flow |

### Writing an E2E test

```ts
// e2e/feature.spec.ts
import { test, expect } from "@playwright/test";

test("feature does the thing", async ({ page }) => {
  await page.goto("/home");
  await expect(page.getByRole("heading", { name: "Popular Categories" })).toBeVisible();
});
```

Keep E2E tests resilient: assert on roles/labels, not exact copy or timing.

## Running Both

```bash
pnpm test && pnpm test:e2e
```

CI gates: `pnpm build` (type-check), `pnpm lint` (0 errors), `pnpm test`, `pnpm test:e2e`.
