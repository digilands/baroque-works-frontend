import "server-only";
import {
  getMyHandymanProfile,
  getMyHirerProfile,
  type ApiUser,
} from "./queries";

/**
 * Single source of truth for post-authentication routing. Used by the
 * dashboard gate and the Google OAuth callback so both agree on where an
 * authenticated user belongs based on role AND profile completeness.
 *
 * - No session -> /auth/login
 * - Admin -> /admin (separate console)
 * - No role (fresh signup / OAuth) -> /auth/role-selection
 * - Handyman without profile -> /auth/serviceselection (onboarding)
 * - Client without hirer profile -> /auth/onboarding/client
 * - Otherwise -> /dashboard (role-appropriate view)
 */
export async function resolvePostAuthDestination(
  user: ApiUser | null,
): Promise<string> {
  if (!user) return "/auth/login";
  if (user.role === "admin") return "/admin";
  if (!user.role) return "/auth/role-selection";

  if (user.role === "handyman") {
    const profile = await getMyHandymanProfile();
    return profile ? "/dashboard" : "/auth/serviceselection";
  }

  const hirer = await getMyHirerProfile();
  return hirer?.profile_completed ? "/dashboard" : "/auth/onboarding/client";
}
