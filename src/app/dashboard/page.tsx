import { redirect } from "next/navigation";
import HandymanDashboard from "@/components/dashboard/HandymanDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import {
  getBookings,
  getMyHandymanProfile,
  getMyHirerProfile,
  getSessionUser,
} from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

/**
 * Dashboard entry — server gate for auth, role, and profile completion.
 * - No session -> /auth/login (middleware normally handles this first)
 * - Admin -> /admin (separate login flow)
 * - No role -> /auth/role-selection (first-time signup)
 * - Handyman without profile -> /auth/serviceselection (onboarding)
 * - Client -> client dashboard (hirer onboarding lands in Phase 4)
 */
export default async function DashboardPage() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");

  if (user.role === "admin") redirect("/admin");
  if (!user.role) redirect("/auth/role-selection");

  if (user.role === "handyman") {
    const profile = await getMyHandymanProfile();
    if (!profile) redirect("/auth/serviceselection");
    return <HandymanDashboard />;
  }

  await getMyHirerProfile();
  const { bookings } = await getBookings({ limit: 10 });
  return <ClientDashboard bookings={bookings} userName={user.fullname} />;
}
