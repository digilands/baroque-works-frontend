"use client";
import React, { useMemo, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import type { ApiBooking } from "@/lib/server/queries";

interface ScheduleWidgetProps {
  bookings?: ApiBooking[];
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function hasJobOn(bookings: ApiBooking[], day: Date): boolean {
  return bookings.some((b) => {
    if (b.status === "CANCELLED" || !b.scheduledDate) return false;
    const d = new Date(b.scheduledDate);
    return !Number.isNaN(d.getTime()) && isSameDay(d, day);
  });
}

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Week-strip schedule widget. Month/week navigation is interactive;
 * job dots/count derive from bookings with a scheduledDate.
 */
const ScheduleWidget = ({ bookings = [] }: ScheduleWidgetProps) => {
  const today = useMemo(() => new Date(), []);
  const [selected, setSelected] = useState<Date>(today);
  /** Offset in weeks from the week containing `today`. */
  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(() => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay() + weekOffset * 7);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [today, weekOffset]);

  const days = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + i);
        return d;
      }),
    [weekStart],
  );

  const jobsToday = useMemo(
    () => bookings.filter((b) => b.status !== "CANCELLED" && hasJobOn([b], today)).length,
    [bookings, today],
  );

  const jobsSelected = useMemo(
    () => hasJobOn(bookings, selected),
    [bookings, selected],
  );

  const monthLabel = MONTH_LABELS[selected.getMonth()];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm w-full bg-white">
      <div className="bg-gray-50/80 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Schedule</h3>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
          <span>{monthLabel}</span>
          <div className="flex gap-1 ml-1 border-l border-gray-200 pl-1">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => setWeekOffset((w) => w - 1)}
              className="hover:text-black p-0.5 rounded hover:bg-gray-100 transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
            </button>
            <button
              type="button"
              aria-label="Next week"
              onClick={() => setWeekOffset((w) => w + 1)}
              className="hover:text-black p-0.5 rounded hover:bg-gray-100 transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} />
            </button>
          </div>
          <HugeiconsIcon
            icon={Calendar01Icon}
            size={14}
            className="ml-1 text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 flex-1">
        {/* Day-of-week labels (first 6 columns + trailing chevron slot) */}
        <div className="flex justify-between text-xs font-medium text-gray-400 mb-4">
          {DAY_LABELS.slice(0, 6).map((d, i) => (
            <div key={`${d}-${i}`} className="w-8 text-center">
              {d}
            </div>
          ))}
          <div className="w-8 text-center" aria-hidden />
        </div>

        {/* Date row */}
        <div className="flex justify-between text-sm font-medium mb-6 items-center">
          <button
            type="button"
            aria-label="Earlier days"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {days.map((day) => {
            const isSelected = isSameDay(day, selected);
            const isToday = isSameDay(day, today);
            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => setSelected(day)}
                aria-label={day.toDateString()}
                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors relative ${
                  isSelected
                    ? "bg-black text-white shadow-md"
                    : isToday
                      ? "text-gray-900 font-bold hover:bg-gray-50"
                      : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {day.getDate()}
                {hasJobOn(bookings, day) && !isSelected && (
                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
          <button
            type="button"
            aria-label="Later days"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>

        <div className="flex justify-between items-center pt-5 border-t border-dashed border-gray-200">
          <p className="text-sm text-gray-900 font-medium">
            {isSameDay(selected, today) ? (
              <>
                You have <span className="font-bold">{jobsToday} jobs</span>{" "}
                today
              </>
            ) : jobsSelected ? (
              <>
                <span className="font-bold">Jobs</span> scheduled this day
              </>
            ) : (
              <>No jobs scheduled</>
            )}
          </p>
          <Link
            href="/dashboard/bookings"
            className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 font-medium"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScheduleWidget;
