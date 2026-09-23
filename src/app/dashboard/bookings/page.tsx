import BookingsList from "@/app/ui/bookings/BookingsList";
import { getBookings } from "@/lib/server/queries";
import { requireSessionUser } from "@/lib/server/session-guard";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const user = await requireSessionUser("/dashboard/bookings");
  const { bookings } = await getBookings({ limit: 30 });
  return <BookingsList bookings={bookings} role={user.role ?? undefined} />;
}
