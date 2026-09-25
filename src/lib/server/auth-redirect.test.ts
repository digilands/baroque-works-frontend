import { describe, it, expect, vi, beforeEach } from "vitest";
import { resolvePostAuthDestination } from "@/lib/server/auth-redirect";
import {
  getMyHandymanProfile,
  getMyHirerProfile,
  type ApiUser,
} from "@/lib/server/queries";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/server/queries", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/server/queries")>();
  return {
    ...actual,
    getMyHandymanProfile: vi.fn(),
    getMyHirerProfile: vi.fn(),
  };
});

const mockedHandyman = vi.mocked(getMyHandymanProfile);
const mockedHirer = vi.mocked(getMyHirerProfile);

const baseUser = {
  _id: "u1",
  email: "test@example.com",
  fullname: "Test User",
};

// The backend returns `role: null` for fresh signups even though the
// generated type omits it — cast to exercise the real runtime shape.
const userWithRole = (role: ApiUser["role"] | null): ApiUser =>
  ({ ...baseUser, role: role as ApiUser["role"] }) as ApiUser;

beforeEach(() => {
  vi.resetAllMocks();
});

describe("resolvePostAuthDestination", () => {
  it("sends missing sessions to login", async () => {
    await expect(resolvePostAuthDestination(null)).resolves.toBe("/auth/login");
  });

  it("sends admins to the console", async () => {
    await expect(
      resolvePostAuthDestination(userWithRole("admin")),
    ).resolves.toBe("/admin");
  });

  it("sends role-less users (fresh signup/OAuth) to role selection", async () => {
    await expect(
      resolvePostAuthDestination(userWithRole(null)),
    ).resolves.toBe("/auth/role-selection");
  });

  it("sends handymen without a profile to onboarding", async () => {
    mockedHandyman.mockResolvedValue(null);
    await expect(
      resolvePostAuthDestination(userWithRole("handyman")),
    ).resolves.toBe("/auth/serviceselection");
  });

  it("sends handymen with a profile to the dashboard", async () => {
    mockedHandyman.mockResolvedValue({ _id: "h1" });
    await expect(
      resolvePostAuthDestination(userWithRole("handyman")),
    ).resolves.toBe("/dashboard");
  });

  it("sends clients without a hirer profile to client onboarding", async () => {
    mockedHirer.mockResolvedValue(null);
    await expect(
      resolvePostAuthDestination(userWithRole("client")),
    ).resolves.toBe("/auth/onboarding/client");
  });

  it("sends clients with a hirer profile to the dashboard", async () => {
    mockedHirer.mockResolvedValue({ _id: "h1", profile_completed: true });
    await expect(
      resolvePostAuthDestination(userWithRole("client")),
    ).resolves.toBe("/dashboard");
  });

  it("sends clients with an incomplete hirer profile back to onboarding", async () => {
    mockedHirer.mockResolvedValue({ _id: "h1", profile_completed: false });
    await expect(
      resolvePostAuthDestination(userWithRole("client")),
    ).resolves.toBe("/auth/onboarding/client");
  });
});
