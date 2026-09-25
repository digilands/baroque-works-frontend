import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionUser, type ApiUser } from "./queries";

/**
 * Drop auth cookies after a failed session lookup. Required before bouncing
 * to login: `src/proxy.ts` only checks for an `accessToken` cookie, so a
 * stale cookie would immediately redirect the user back to the original path
 * — the classic infinite /dashboard <-> /auth/login loop.
 */
async function clearSessionCookies(): Promise<void> {
  const store = await cookies();
  store.delete("accessToken");
  store.delete("refreshToken");
}

/** Send the browser to login with a `?next=` return address (proxy skips these). */
function loginRedirect(returnTo: string): never {
  redirect(`/auth/login?next=${encodeURIComponent(returnTo)}`);
}

/**
 * Fetch the session user or clear cookies and redirect to login.
 * Prefer this over `getSessionUser().catch(() => null)` + `redirect`
 * so control-flow analysis sees a non-null user and the proxy cannot loop.
 */
export async function requireSessionUser(returnTo: string): Promise<ApiUser> {
  try {
    return await getSessionUser();
  } catch {
    await clearSessionCookies();
    return loginRedirect(returnTo);
  }
}
