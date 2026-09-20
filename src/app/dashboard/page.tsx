import { redirect } from "next/navigation";
import HandymanDashboard from "@/components/dashboard/HandymanDashboard";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import { resolvePostAuthDestination } from "@/lib/server/auth-redirect";
import { getBookings, getSessionUser } from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

/**
 * Dashboard entry — delegates auth/role/completeness gating to the shared
 * post-auth resolver, then renders the role-appropriate dashboard.
 */
export default async function DashboardPage() {
  const user = await getSessionUser().catch(() => null);
  const destination = await resolvePostAuthDestination(user);
  if (destination !== "/dashboard") redirect(destination);

  if (user?.role === "handyman") return <HandymanDashboard />;

  const { bookings } = await getBookings({ limit: 10 });
  return <ClientDashboard bookings={bookings} userName={user?.fullname} />;
}
