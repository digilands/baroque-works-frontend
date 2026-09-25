"use client";

import React, { useCallback, useMemo, useState } from "react";
import StatsCard, { type StatsCardProps } from "@/components/dashboard/StatsCard";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";
import UpcomingJob, { type UpcomingJobData } from "@/components/dashboard/UpcomingJob";
import ReviewsList from "@/components/dashboard/ReviewsList";
import MessagesList from "@/components/dashboard/MessagesList";
import ErrorBoundary from "@/components/ErrorBoundary";
import InsightsChart from "@/components/dashboard/InsightsChart";
import { useSSE } from "@/hooks/useSSE";
import type { ApiBooking } from "@/lib/server/queries";
import { formatNaira } from "@/lib/server/mappers";

export type DashboardRole = "client" | "handyman";

export interface DashboardViewProps {
  role: DashboardRole;
  userName?: string;
  /** Server-computed stat card props (role-specific). */
  stats: StatsCardProps[];
  bookings: ApiBooking[];
  upcoming: UpcomingJobData | null;
  /** Handyman rating for optional live refresh — not recomputed from bookings. */
  rating?: number;
}

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED", "IN_PROGRESS"]);

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

function activeContractCount(bookings: ApiBooking[]): number {
  return bookings.filter((b) => ACTIVE_STATUSES.has(b.status ?? "")).length;
}

/** Shallow fingerprint so identical SSE snapshots don't force a re-render. */
function bookingsKey(list: ApiBooking[]): string {
  return list
    .map((b) => `${b._id}:${b.status}:${b.totalAmount}:${b.paymentStatus}`)
    .join("|");
}

/**
 * Shared dashboard body for BOTH roles — identical layout, role-specific
 * data only. Mobile: single column in DOM order (Insights → Schedule →
 * Upcoming → Reviews/Messages). Desktop (lg+): explicit grid placement
 * matching the reference design (left rail + right widgets).
 */
export default function DashboardView({
  role,
  userName,
  stats: initialStats,
  bookings: initialBookings,
  upcoming,
}: DashboardViewProps) {
  const [bookings, setBookings] = useState<ApiBooking[]>(initialBookings);
  const [stats, setStats] = useState<StatsCardProps[]>(initialStats);
  const bookingsRef = React.useRef(initialBookings);

  // Live bookings snapshot — recompute booking-derived stats only.
  // Bail out when the snapshot matches what we already show so the
  // ~20s SSE reconnect doesn't thrash the tree (chart flicker).
  const handleSSE = useCallback(
    (data: unknown) => {
      const list = (data as { bookings?: ApiBooking[] })?.bookings;
      if (!Array.isArray(list)) return;
      if (bookingsKey(list) === bookingsKey(bookingsRef.current)) return;
      bookingsRef.current = list;
      setBookings(list);
      setStats((prev) =>
        prev.map((card) => {
          if (role === "handyman" && card.type === "earnings") {
            return { ...card, value: earningsLast30d(list) };
          }
          if (role === "client" && card.type === "contracts") {
            return { ...card, value: activeContractCount(list) };
          }
          return card;
        }),
      );
    },
    [role],
  );

  useSSE("bookings", handleSSE);

  const firstName = useMemo(() => {
    if (!userName) return "";
    return userName.split(" ")[0];
  }, [userName]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome — desktop only (mobile header already shows the page title) */}
      {firstName && (
        <h1 className="hidden lg:block text-2xl font-bold text-gray-900">
          Welcome, {firstName}
        </h1>
      )}

      {/* Stats — mobile: Earnings full-width + 2-up; md+: 3 equal */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {stats.map((card, i) => (
          <div
            key={card.title}
            className={i === 0 ? "col-span-2 md:col-span-1" : "col-span-1"}
          >
            <ErrorBoundary
              fallback={
                <div className="h-32 md:h-40 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 text-sm">
                  Error loading stats
                </div>
              }
            >
              <StatsCard {...card} />
            </ErrorBoundary>
          </div>
        ))}
      </div>

      {/*
        Content grid.
        DOM order (mobile): Insights → Schedule → Upcoming → Reviews/Messages.
        Desktop placement: left col = Insights + Reviews/Messages,
        right col = Schedule + UpcomingJob.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4 sm:gap-6 min-w-0 lg:auto-rows-min">
        {/* Insights — left / first on mobile */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <ErrorBoundary
            fallback={
              <div className="h-[300px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                Error loading chart
              </div>
            }
          >
            <InsightsChart />
          </ErrorBoundary>
        </div>

        {/* Schedule — right rail on desktop; second on mobile */}
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
          <ErrorBoundary
            fallback={
              <div className="h-[300px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                Error loading schedule
              </div>
            }
          >
            <ScheduleWidget bookings={bookings} />
          </ErrorBoundary>
        </div>

        {/* Upcoming job — right rail bottom on desktop; third on mobile */}
        <div className="min-w-0 lg:col-start-2 lg:row-start-2">
          <ErrorBoundary
            fallback={
              <div className="h-[300px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                Error loading job
              </div>
            }
          >
            <UpcomingJob job={upcoming} />
          </ErrorBoundary>
        </div>

        {/* Reviews + Messages — left bottom on desktop; last on mobile */}
        <div className="min-w-0 lg:col-start-1 lg:row-start-2 grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <ErrorBoundary
            fallback={
              <div className="h-[200px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                Error loading reviews
              </div>
            }
          >
            <ReviewsList />
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <div className="h-[200px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                Error loading messages
              </div>
            }
          >
            <MessagesList />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
