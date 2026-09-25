"use client";

import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon, Cancel01Icon } from "@hugeicons/core-free-icons";
import StyledSelect from "@/components/ui/StyledSelect";

export interface FeedFilterValues {
  pricingModel: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  radius: string;
}

export const EMPTY_FEED_FILTERS: FeedFilterValues = {
  pricingModel: "",
  minPrice: "",
  maxPrice: "",
  rating: "",
  radius: "",
};

export function countActiveFilters(f: FeedFilterValues): number {
  return [f.pricingModel, f.minPrice, f.maxPrice, f.rating, f.radius].filter(
    (v) => v !== "",
  ).length;
}

const PRICING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "fixed", label: "Fixed" },
  { value: "hourly", label: "Hourly" },
  { value: "contract", label: "Contract" },
];

const RATING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "4.5", label: "4.5+" },
  { value: "4", label: "4.0+" },
  { value: "3", label: "3.0+" },
];

const RADIUS_OPTIONS = [
  { value: "", label: "Any distance" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
];

const inputClasses =
  "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-600";

interface HomeFiltersProps {
  draft: FeedFilterValues;
  onDraftChange: (next: FeedFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}

/** Filter panel opened from the home feed Filter button (no category/availability). */
export default function HomeFilters({
  draft,
  onDraftChange,
  onApply,
  onClear,
  onClose,
}: HomeFiltersProps) {
  const set = (key: keyof FeedFilterValues) => (value: string) =>
    onDraftChange({ ...draft, [key]: value });

  return (
    <div className="absolute left-0 md:left-auto md:right-0 top-full mt-2 z-40 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-50 duration-150">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Filters
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>
      </div>

      <label className="block">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Pricing
        </span>
        <div className="mt-1 w-full">
          <StyledSelect
            value={draft.pricingModel}
            onChange={set("pricingModel")}
            options={PRICING_OPTIONS}
            aria-label="Pricing model"
            className="w-full"
            triggerClassName="px-4 py-3 rounded-xl"
          />
        </div>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Min ₦
          </span>
          <input
            value={draft.minPrice}
            onChange={(e) => set("minPrice")(e.target.value)}
            type="number"
            min={0}
            placeholder="0"
            className={`${inputClasses} mt-1`}
          />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Max ₦
          </span>
          <input
            value={draft.maxPrice}
            onChange={(e) => set("maxPrice")(e.target.value)}
            type="number"
            min={0}
            placeholder="Any"
            className={`${inputClasses} mt-1`}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Min rating
        </span>
        <div className="mt-1 w-full">
          <StyledSelect
            value={draft.rating}
            onChange={set("rating")}
            options={RATING_OPTIONS}
            aria-label="Minimum rating"
            className="w-full"
            triggerClassName="px-4 py-3 rounded-xl"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Radius (km)
        </span>
        <div className="mt-1 w-full">
          <StyledSelect
            value={draft.radius}
            onChange={set("radius")}
            options={RADIUS_OPTIONS}
            aria-label="Search radius"
            className="w-full"
            triggerClassName="px-4 py-3 rounded-xl"
          />
        </div>
      </label>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onClear}
          className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export interface FeedChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function FeedChips({
  chips,
  total,
}: {
  chips: FeedChip[];
  /** When set, renders a leading “Active filters (N)” pill (mobile mock). */
  total?: number;
}) {
  if (chips.length === 0) return null;
  return (
    <div className="mb-5 flex items-center gap-2 sm:gap-3 bg-white border border-gray-100 shadow-sm rounded-full pl-4 pr-2 py-1.5">
      <span className="shrink-0 text-sm font-medium text-gray-900 whitespace-nowrap">
        Active filters ({typeof total === "number" ? total : chips.length})
      </span>
      <span aria-hidden="true" className="w-px h-5 bg-gray-200 shrink-0" />
      <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto no-scrollbar">
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="shrink-0 inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-bold whitespace-nowrap"
          >
            {chip.label}
            <button
              type="button"
              onClick={chip.onRemove}
              aria-label={`Remove ${chip.label} filter`}
              className="p-0.5 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export function FilterButton({
  count,
  open,
  onClick,
  children,
  variant = "icon",
}: {
  count: number;
  open: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  /** "icon" = mobile black square (left); "pill" = desktop white pill (right). */
  variant?: "icon" | "pill";
}) {
  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={count > 0 ? `Filters, ${count} active` : "Filters"}
        className="relative inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all shrink-0 whitespace-nowrap"
      >
        <HugeiconsIcon icon={FilterIcon} size={16} className="text-gray-500" />
        <span className="font-medium">Filter</span>
        {count > 0 && (
          <span className="text-gray-400 font-medium leading-none">{count}</span>
        )}
        {children}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-haspopup="dialog"
      aria-label="Filters"
      className="relative inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-2xl text-white hover:bg-black transition-all shrink-0"
    >
      <HugeiconsIcon icon={FilterIcon} size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center bg-indigo-600 text-white rounded-full text-[10px] font-bold leading-none">
          {count}
        </span>
      )}
      {children}
    </button>
  );
}
