"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar01Icon,
  Cancel01Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";

interface DateTimePickerProps {
  /** `YYYY-MM-DDTHH:mm` (datetime-local compatible) or "" */
  value: string;
  onChange: (value: string) => void;
  label?: string;
  name?: string;
  required?: boolean;
  error?: string;
  /** When false, only a date is collected (time forced to 00:00). */
  withTime?: boolean;
  /** When true, only a time is collected (value "HH:mm", no calendar). */
  timeOnly?: boolean;
  placeholder?: string;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
/** Hourly slots 8am–6pm — matches the dashboard schedule aesthetic. */
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => {
  const hour24 = i + 8;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
  return {
    value: `${String(hour24).padStart(2, "0")}:00`,
    label: `${hour12}:00 ${suffix}`,
  };
});

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

interface DateParts {
  y: number;
  m: number;
  d: number;
  hh: string;
  mm: string;
}

function toLocalParts(iso: string): DateParts | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return {
    y: date.getFullYear(),
    m: date.getMonth(),
    d: date.getDate(),
    hh: pad(date.getHours()),
    mm: pad(date.getMinutes()),
  };
}

function formatDisplay(value: string, withTime: boolean): string | null {  const parts = toLocalParts(value);
  if (!parts) return null;
  const date = new Date(parts.y, parts.m, parts.d);
  const day = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  if (!withTime || (parts.hh === "00" && parts.mm === "00")) return day;
  const hour24 = Number(parts.hh);
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 > 12 ? hour24 - 12 : hour24 || 12;
  return `${day} at ${hour12}:${parts.mm} ${suffix}`;
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate();
}

interface TimeParts {
  hh: string;
  mm: string;
}

/**
 * Parse a time-only value. Accepts 24h "HH:mm" (what the picker writes)
 * and legacy 12h "h:mm AM/PM" (existing saved values).
 */
function toTimeParts(value: string): TimeParts | null {
  const raw = value.trim();
  if (!raw) return null;
  const m24 = /^(\d{1,2}):(\d{2})$/.exec(raw);
  if (m24) {
    const h = Number(m24[1]);
    const m = Number(m24[2]);
    if (h > 23 || m > 59) return null;
    return { hh: pad(h), mm: m24[2] };
  }
  const m12 = /^(\d{1,2}):(\d{2})\s*([AP])\.?M\.?$/i.exec(raw);
  if (m12) {
    let h = Number(m12[1]);
    const m = Number(m12[2]);
    if (h < 1 || h > 12 || m > 59) return null;
    if (/p/i.test(m12[3])) h = h === 12 ? 12 : h + 12;
    else h = h === 12 ? 0 : h;
    return { hh: pad(h), mm: m12[2] };
  }
  return null;
}

function formatTimeOnly(value: string): string | null {
  const parts = toTimeParts(value);
  if (!parts) return null;
  const hour24 = Number(parts.hh);
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${parts.mm} ${suffix}`;
}

/**
 * Modern calendar + time-slot picker (replaces native datetime-local).
 * Visual language matches the dashboard Schedule widget: black selected
 * circle, chevron month nav, chip-style time slots.
 */
export default function DateTimePicker({
  value,
  onChange,
  label,
  name,
  required,
  error,
  withTime = true,
  timeOnly = false,
  placeholder,
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = toLocalParts(value);

  const [view, setView] = useState(() => {
    const parts = selected ?? toLocalParts(new Date().toISOString());
    return { y: parts?.y ?? new Date().getFullYear(), m: parts?.m ?? new Date().getMonth() };
  });

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const grid = useMemo(() => {
    const firstDow = new Date(view.y, view.m, 1).getDay();
    const total = daysInMonth(view.y, view.m);
    const cells: (number | null)[] = Array.from({ length: firstDow }, () => null);
    for (let d = 1; d <= total; d++) cells.push(d);
    return cells;
  }, [view]);

  const pickDate = (day: number) => {
    const timePart = withTime
      ? selected
        ? `${selected.hh}:${selected.mm}`
        : "09:00"
      : "00:00";
    onChange(`${view.y}-${pad(view.m + 1)}-${pad(day)}T${timePart}`);
    if (!withTime) setOpen(false);
  };

  const pickTime = (slotValue: string) => {
    if (timeOnly) {
      onChange(slotValue);
      setOpen(false);
      return;
    }
    if (selected) {
      onChange(
        `${selected.y}-${pad(selected.m + 1)}-${pad(selected.d)}T${slotValue}`,
      );
    } else {
      const now = new Date();
      onChange(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${slotValue}`,
      );
    }
    setOpen(false);
  };

  const display = timeOnly ? formatTimeOnly(value) : formatDisplay(value, withTime);
  const placeholderText =
    placeholder ?? (timeOnly ? "Pick a time" : "Pick a date & time");
  /** Currently selected slot in "HH:mm" — drives the active chip style. */
  const activeSlot = timeOnly
    ? (() => {
        const t = toTimeParts(value);
        return t ? `${t.hh}:${t.mm}` : null;
      })()
    : selected
      ? `${selected.hh}:${selected.mm}`
      : null;
  const inputId = name ?? "datetime-picker";

  return (
    <div ref={rootRef} className="relative w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <button
        type="button"
        id={inputId}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm text-left flex items-center justify-between gap-3 focus:outline-none focus:ring-4 transition-all ${
          error
            ? "border-red-200 focus:ring-red-100/50"
            : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
        }`}
      >
        <span className={display ? "text-gray-900 font-medium" : "text-gray-400"}>
          {display ?? placeholderText}
        </span>
        <span className="flex items-center gap-1.5 shrink-0 text-gray-400">
          {(withTime || timeOnly) && <HugeiconsIcon icon={Clock01Icon} size={16} />}
          {!timeOnly && <HugeiconsIcon icon={Calendar01Icon} size={16} />}
        </span>
      </button>

      {error && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</p>}

      {open && (
        <div
          role="dialog"
          aria-label={label ?? "Date and time picker"}
          className="absolute z-50 left-0 right-0 sm:left-auto sm:right-auto sm:w-[320px] mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-4"
        >
          {!timeOnly && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-900">
                  {MONTHS[view.m]} {view.y}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Previous month"
                    onClick={() =>
                      setView((v) =>
                        v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 },
                      )
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next month"
                    onClick={() =>
                      setView((v) =>
                        v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 },
                      )
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </button>
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 ml-1"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((d, i) => (
                  <span
                    key={`${d}-${i}`}
                    className="h-7 flex items-center justify-center text-[10px] font-bold text-gray-400"
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {grid.map((day, i) => {
                  if (day === null) return <span key={`pad-${i}`} />;
                  const isSelected =
                    selected &&
                    selected.y === view.y &&
                    selected.m === view.m &&
                    selected.d === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => pickDate(day)}
                      className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-colors ${
                        isSelected
                          ? "bg-black text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {(withTime || timeOnly) && (
            <div className={timeOnly ? "" : "mt-3 pt-3 border-t border-gray-100"}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Time
                </p>
                {timeOnly && (
                  <button
                    type="button"
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={14} />
                  </button>
                )}
              </div>
              <div
                className={`grid grid-cols-3 gap-1.5 ${
                  timeOnly ? "" : "max-h-28 overflow-y-auto pr-0.5"
                }`}
              >
                {TIME_SLOTS.map((slot) => {
                  const active = activeSlot === slot.value;
                  return (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => pickTime(slot.value)}
                      className={`py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                        active
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
