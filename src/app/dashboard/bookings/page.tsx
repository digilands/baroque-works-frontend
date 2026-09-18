import { redirect } from "next/navigation";
import BookingsList from "@/app/ui/bookings/BookingsList";
import { getBookings, getSessionUser } from "@/lib/server/queries";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const user = await getSessionUser().catch(() => null);
  if (!user) redirect("/auth/login");
  const { bookings } = await getBookings({ limit: 30 });
  return <BookingsList bookings={bookings} role={user.role ?? undefined} />;
}
