"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  ArrowRight01Icon,
  SearchIcon,
} from "@hugeicons/core-free-icons";
import type { ApiBooking } from "@/lib/server/queries";
import { formatDate, formatNaira } from "@/lib/server/mappers";
import { useSSE } from "@/hooks/useSSE";

interface ClientDashboardProps {
  bookings: ApiBooking[];
  userName?: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  IN_PROGRESS: "bg-indigo-50 text-indigo-600",
  COMPLETED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};

export default function ClientDashboard({ bookings, userName }: ClientDashboardProps) {
  // Live bookings via SSE (snapshot per reconnect); falls back to the
  // server-rendered list when streaming is unavailable.
  const [liveBookings, setLiveBookings] = useState(bookings);
  useSSE("bookings", (data) => {
    const list = (data as { bookings?: ApiBooking[] })?.bookings;
    if (Array.isArray(list)) setLiveBookings(list);
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-gray-500 text-sm">
          Track your bookings and find trusted pros
        </p>
      </div>

      <Link
        href="/home"
        className="flex items-center justify-between bg-gray-900 text-white rounded-2xl p-5 hover:bg-black transition-all shadow-lg shadow-gray-200 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
            <HugeiconsIcon icon={SearchIcon} size={20} />
          </div>
          <div>
            <p className="font-bold">Find a professional</p>
            <p className="text-xs text-white/60">Browse vetted handymen near you</p>
          </div>
        </div>
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={20}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">My bookings</h2>
        {liveBookings.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HugeiconsIcon icon={Calendar01Icon} size={24} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1">No bookings yet</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              When you book a service, it will appear here with live status updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {liveBookings.map((booking) => {
              const id = booking._id ?? "";
              const status = booking.status ?? "PENDING";
              return (
                <div
                  key={id}
                  className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-400">
                      {booking.bookingSource === "JOB_PROPOSAL" ? "Job proposal" : "Direct booking"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        {formatDate(booking.scheduledDate ?? booking.createdAt)}
                      </p>
                      <p className="font-bold text-gray-900">
                        {formatNaira(booking.totalAmount ?? 0)}
                        <span className="ml-2 text-xs font-medium text-gray-400">
                          {booking.paymentStatus ?? "pending"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {booking.serviceId && (
                        <Link
                          href={`/dashboard/disputes/new?serviceId=${booking.serviceId}`}
                          className="text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          Report issue
                        </Link>
                      )}
                      <span className="text-xs font-mono text-gray-300">
                        #{id.slice(-6)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
