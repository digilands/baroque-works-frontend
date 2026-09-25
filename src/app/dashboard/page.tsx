import { redirect } from "next/navigation";
import DashboardView, {
  type DashboardRole,
  type DashboardViewProps,
} from "@/components/dashboard/DashboardView";
import type { StatsCardProps } from "@/components/dashboard/StatsCard";
import type { UpcomingJobData } from "@/components/dashboard/UpcomingJob";
import { resolvePostAuthDestination } from "@/lib/server/auth-redirect";
import { formatDate, formatNaira } from "@/lib/server/mappers";
import {
  getBookings,
  getHirerById,
  getJobById,
  getMyHandymanProfile,
  getMyHirerProfile,
  getUserById,
  type ApiBooking,
} from "@/lib/server/queries";
import { requireSessionUser } from "@/lib/server/session-guard";

// Backend-driven: always render per request, never prerender at build.
export const dynamic = "force-dynamic";

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED", "IN_PROGRESS"]);
/** Mock rating count until the backend exposes a reviews summary. */
const MOCK_RATING_COUNT = 234;

function earningsLast30d(bookings: ApiBooking[]): string {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const total = bookings
    .filter(
      (b) =>
        b.status !== "CANCELLED" &&
        (b.status === "COMPLETED" || b.paymentStatus === "paid") &&
        b.createdAt &&
        new Date(b.createdAt).getTime() >= cutoff,
    )
    .reduce((sum, b) => sum + (b.totalAmount ?? 0), 0);
  return formatNaira(total);
}

function pickUpcoming(bookings: ApiBooking[]): ApiBooking | undefined {
  const now = Date.now();
  // Grace window: still show today's jobs a few hours past start.
  const horizon = now - 6 * 60 * 60 * 1000;
  return bookings
    .filter(
      (b) =>
        ACTIVE_STATUSES.has(b.status ?? "") &&
        b.scheduledDate &&
        new Date(b.scheduledDate).getTime() >= horizon,
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledDate!).getTime() -
        new Date(b.scheduledDate!).getTime(),
    )[0];
}

/**
 * Enrich the next booking with names + job details for the Upcoming Job card.
 * All lookups are best-effort — failures fall back to generic labels.
 */
async function enrichUpcoming(
  booking: ApiBooking,
  role: DashboardRole,
): Promise<UpcomingJobData | null> {
  if (!booking) return null;

  const when = booking.scheduledDate ? new Date(booking.scheduledDate) : null;
  const isToday =
    when &&
    when.toDateString() === new Date().toDateString();
  const dateLabel = when
    ? isToday
      ? "Today"
      : formatDate(booking.scheduledDate!)
    : "—";
  const scheduleLabel = when
    ? when.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "To be confirmed";

  const [job, person] = await Promise.all([
    booking.jobId
      ? getJobById(booking.jobId).catch(() => null)
      : Promise.resolve(null),
    role === "handyman"
      ? getHirerById(booking.hirerId)
          .then((hirer) =>
            hirer.user ? getUserById(String(hirer.user)).catch(() => null) : null,
          )
          .catch(() => null)
      : getUserById(booking.handymanId).catch(() => null),
  ]);

  const coords = job?.location?.coordinates;
  const location =
    coords && coords.length === 2
      ? `${coords[1]!.toFixed(4)}, ${coords[0]!.toFixed(4)}`
      : "Location shared after booking";

  return {
    clientName: person?.fullname ?? (role === "handyman" ? "Client" : "Professional"),
    category: job?.title ? "Job request" : "Direct booking",
    title: job?.title ?? (booking.serviceId ? "Booked service" : "Scheduled work"),
    dateLabel,
    scheduleLabel,
    location,
    description: job?.description?.slice(0, 160) || "No description",
    jobId: booking.jobId ?? undefined,
  };
}

function handymanStats(
  rating: number | undefined,
  jobsCompleted: number | undefined,
  bookings: ApiBooking[],
): StatsCardProps[] {
  const completed = jobsCompleted ?? bookings.filter((b) => b.status === "COMPLETED").length;
  const finishedOrActive = bookings.filter((b) => b.status !== "CANCELLED").length;
  const totalJobs = Math.max(finishedOrActive, completed);
  return [
    {
      title: "Earnings",
      value: earningsLast30d(bookings),
      subtitle: "Last month",
      type: "earnings",
    },
    {
      title: "Rating",
      value: (rating ?? 0).toFixed(1),
      subtitle: `${MOCK_RATING_COUNT} ratings`,
      type: "rating",
    },
    {
      title: "Jobs completed",
      value: String(completed),
      subtext: `out of ${totalJobs}`,
      subtitle: `${totalJobs} jobs`,
      type: "jobs",
    },
  ];
}

function clientStats(
  hiringStats:
    | {
        totalSpent?: number;
        jobsPosted?: number;
        activeContracts?: number;
      }
    | undefined,
  bookings: ApiBooking[],
): StatsCardProps[] {
  const active =
    hiringStats?.activeContracts ??
    bookings.filter((b) => ACTIVE_STATUSES.has(b.status ?? "")).length;
  return [
    {
      title: "Total spent",
      value: formatNaira(hiringStats?.totalSpent ?? 0),
      subtitle: "All time",
      type: "spent",
    },
    {
      title: "Jobs posted",
      value: String(hiringStats?.jobsPosted ?? 0),
      subtitle: "jobs",
      type: "posts",
    },
    {
      title: "Active contracts",
      value: String(active),
      subtitle: "in progress",
      type: "contracts",
    },
  ];
}

/**
 * Dashboard entry — delegates auth/role/completeness gating to the shared
 * post-auth resolver, then renders the unified role-aware dashboard.
 */
export default async function DashboardPage() {
  const user = await requireSessionUser("/dashboard");
  const destination = await resolvePostAuthDestination(user);
  if (destination !== "/dashboard") redirect(destination);

  const role: DashboardRole = user?.role === "handyman" ? "handyman" : "client";

  const { bookings } = await getBookings({ limit: 30 });

  let stats: StatsCardProps[];
  let upcoming: UpcomingJobData | null = null;
  const next = pickUpcoming(bookings);
  if (next) upcoming = await enrichUpcoming(next, role);

  if (role === "handyman") {
    const profile = await getMyHandymanProfile();
    stats = handymanStats(profile?.rating, profile?.jobsCompleted, bookings);
  } else {
    const hirer = await getMyHirerProfile();
    stats = clientStats(hirer?.hiringStats, bookings);
  }

  const props: DashboardViewProps = {
    role,
    userName: user?.fullname,
    stats,
    bookings,
    upcoming,
  };

  return <DashboardView {...props} />;
}
