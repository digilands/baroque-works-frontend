"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import Calendar01Icon from "@hugeicons/core-free-icons/Calendar01Icon";
import type { ApiBooking } from "@/lib/server/queries";
import { formatDate, formatNaira } from "@/lib/server/mappers";
import { useUpdateBookingStatus } from "@/hooks/useMarketplace";
import { useSSE } from "@/hooks/useSSE";
import type { BookingStatusUpdate } from "@/lib/api";

interface BookingsListProps {
  bookings: ApiBooking[];
  /** Drives which lifecycle actions render. Defaults to client. */
  role?: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600",
  CONFIRMED: "bg-blue-50 text-blue-600",
  IN_PROGRESS: "bg-indigo-50 text-indigo-600",
  COMPLETED: "bg-green-50 text-green-600",
  CANCELLED: "bg-red-50 text-red-600",
};

const CANCELLABLE = new Set(["PENDING", "CONFIRMED"]);

/** Handyman lifecycle: confirm → start → complete (decline reuses cancel). */
function HandymanBookingActions({
  status,
  busy,
  onTransition,
  onDecline,
}: {
  status: string;
  busy: boolean;
  onTransition: (next: BookingStatusUpdate) => void;
  onDecline: () => void;
}) {
  const btn =
    "px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50";
  if (status === "PENDING") {
    return (
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onTransition("CONFIRMED")}
          disabled={busy}
          className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700`}
        >
          {busy ? "Working…" : "Confirm"}
        </button>
        <button
          onClick={onDecline}
          className={`${btn} border border-gray-200 hover:bg-gray-50`}
        >
          Decline
        </button>
      </div>
    );
  }
  if (status === "CONFIRMED") {
    return (
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onTransition("IN_PROGRESS")}
          disabled={busy}
          className={`${btn} bg-indigo-600 text-white hover:bg-indigo-700`}
        >
          {busy ? "Working…" : "Start job"}
        </button>
      </div>
    );
  }
  if (status === "IN_PROGRESS") {
    return (
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onTransition("COMPLETED")}
          disabled={busy}
          className={`${btn} bg-green-600 text-white hover:bg-green-700`}
        >
          {busy ? "Working…" : "Mark complete"}
        </button>
      </div>
    );
  }
  return null;
}

export default function BookingsList({ bookings, role }: BookingsListProps) {
  const [liveBookings, setLiveBookings] = useState(bookings);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const updateStatus = useUpdateBookingStatus();
  const isHandyman = role === "handyman";

  useSSE("bookings", (data) => {
    const list = (data as { bookings?: ApiBooking[] })?.bookings;
    if (Array.isArray(list)) setLiveBookings(list);
  });

  const patchLocal = (id: string, status: BookingStatusUpdate) =>
    setLiveBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b)),
    );

  const transition = async (
    id: string,
    status: BookingStatusUpdate,
    cancellationReason?: string,
  ): Promise<boolean> => {
    try {
      await updateStatus.mutateAsync({ id, status, cancellationReason });
      patchLocal(id, status);
      return true;
    } catch {
      // error surfaces via updateStatus.error below
      return false;
    }
  };

  const handleCancel = async (id: string) => {
    const ok = await transition(id, "CANCELLED", reason.trim() || undefined);
    if (ok) {
      setCancellingId(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My bookings</h1>
        <p className="text-gray-500 text-sm">Track status and manage cancellations</p>
      </div>

      {updateStatus.error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {updateStatus.error.message}
        </div>
      )}

      {liveBookings.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon icon={Calendar01Icon} size={24} className="text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">No bookings yet</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto mb-6">
            When you book a service, it will appear here with live status updates.
          </p>
          <Link href="/home" className="inline-block px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all">
            Browse services
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {liveBookings.map((booking) => {
            const id = booking._id ?? "";
            const status = booking.status ?? "PENDING";
            const canCancel = CANCELLABLE.has(status);
            const isCancelling = cancellingId === id;
            return (
              <div key={id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}>
                    {status.replace("_", " ")}
                  </span>
                  <span className="text-xs text-gray-400">
                    {booking.bookingSource === "JOB_PROPOSAL" ? "Job proposal" : "Direct booking"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">{formatDate(booking.scheduledDate ?? booking.createdAt)}</p>
                    <p className="font-bold text-gray-900">
                      {formatNaira(booking.totalAmount ?? 0)}
                      <span className="ml-2 text-xs font-medium text-gray-400">{booking.paymentStatus ?? "pending"}</span>
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
                    <span className="text-xs font-mono text-gray-300">#{id.slice(-6)}</span>
                  </div>
                </div>

                {isHandyman ? (
                  <HandymanBookingActions
                    status={status}
                    busy={updateStatus.isPending}
                    onTransition={(next) => transition(id, next)}
                    onDecline={() => setCancellingId(id)}
                  />
                ) : (
                  canCancel && !isCancelling && (
                    <button
                      onClick={() => setCancellingId(id)}
                      className="mt-4 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                    >
                      Cancel booking
                    </button>
                  )
                )}
                {isCancelling && (
                  <div className="mt-4 space-y-3 bg-red-50/50 border border-red-100 rounded-xl p-4">
                    <input
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Reason for cancellation (optional)"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setCancellingId(null);
                          setReason("");
                        }}
                        className="flex-1 py-2.5 border border-gray-200 bg-white rounded-xl text-xs font-bold hover:bg-gray-50"
                      >
                        Keep booking
                      </button>
                      <button
                        onClick={() => handleCancel(id)}
                        disabled={updateStatus.isPending}
                        className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50"
                      >
                        {updateStatus.isPending ? "Cancelling…" : "Confirm cancel"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
