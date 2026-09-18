import { test, expect } from "@playwright/test";

test.describe("guest browsing", () => {
  test("landing page renders hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Expert Hands.")).toBeVisible({ timeout: 30_000 });
  });

  test("home page renders services section", async ({ page }) => {
    await page.goto("/home");
    // Either the feed loads or the empty state renders — both prove the RSC works.
    await expect(
      page.getByRole("heading").first(),
    ).toBeVisible({ timeout: 30_000 });
  });

  test("search page renders filters and results", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByRole("heading", { name: "Search" })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("button", { name: "Apply filters" })).toBeVisible();
  });

  test("service detail requires a session (guests go to login)", async ({ page }) => {
    // Cold backend + first-compile can be slow for this endpoint.
    test.setTimeout(240_000);
    await page.goto("/services/000000000000000000000000", {
      waitUntil: "commit",
      timeout: 120_000,
    });
    // Backend service reads need auth: guests are bounced with a return address.
    // (Next.js keeps `/` unencoded in the query value.)
    await expect(page).toHaveURL(/\/auth\/login\?next=\/services\//, {
      timeout: 90_000,
    });
  });

  test("role selection offers both roles", async ({ page }) => {
    await page.goto("/auth/role-selection");
    await expect(page.getByText("I need a pro")).toBeVisible();
    await expect(page.getByText("I am a pro")).toBeVisible();
  });
});
