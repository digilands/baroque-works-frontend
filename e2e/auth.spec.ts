import { test, expect } from "@playwright/test";

test.describe("auth gates", () => {
  test("/dashboard redirects guests to login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
  });

  test("/dashboard/jobs redirects guests to login", async ({ page }) => {
    await page.goto("/dashboard/jobs");
    await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
  });

  test("new protected pages redirect guests to login", async ({ page }) => {
    const paths = [
      "/dashboard/services",
      "/dashboard/services/abc/edit",
      "/dashboard/profile",
      "/dashboard/bookings",
      "/dashboard/jobs/create",
      "/dashboard/jobs/abc/edit",
      "/dashboard/services/create",
      "/dashboard/disputes/new",
    ];
    for (const path of paths) {
      // Proxy redirects resolve at response headers — no need to wait for
      // the full RSC stream under parallel-worker load.
      await page.goto(path, { waitUntil: "commit" });
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 30_000 });
    }
  });

  test("/admin redirects guests to admin login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 30_000 });
  });

  test("login rejects invalid credentials with an error", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByPlaceholder("name@example.com").fill("nobody@example.com");
    await page.getByPlaceholder("••••••••").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    // Live backend call — invalid creds must surface, never authenticate.
    await expect(page.getByText(/invalid credentials/i)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("signup validates email client-side", async ({ page }) => {
    test.setTimeout(90_000);
    await page.goto("/auth/signup", { timeout: 60_000 });
    await page.getByPlaceholder("Emeka Obi").fill("Test User");
    await page.getByPlaceholder("e.g. emeka@homehero.com").fill("not-an-email");
    await page.getByPlaceholder("••••••••").fill("short");
    await page.getByRole("button", { name: "Continue" }).click();
    await expect(page.getByText("Invalid email")).toBeVisible();
  });

  test("admin login rejects non-admin flow without crashing", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByText("Admin Console")).toBeVisible();
    await page.getByPlaceholder("admin@baroqueworks.com").fill("nobody@example.com");
    await page.getByPlaceholder("••••••••").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    // Either invalid credentials or non-admin — both stay on the page with feedback.
    await expect(page).toHaveURL(/\/admin\/login/, { timeout: 30_000 });
  });
});
