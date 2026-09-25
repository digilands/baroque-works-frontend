"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import Navigation03Icon from "@hugeicons/core-free-icons/Navigation03Icon";
import StyledSelect from "@/components/ui/StyledSelect";
import { useGeolocation } from "@/hooks/useGeolocation";
import type { ServiceCategory } from "@/lib/server/queries";

export interface SearchFilterValues {
  tab: "services" | "pros";
  category: string;
  pricingModel: string;
  minPrice: string;
  maxPrice: string;
  rating: string;
  radius: string;
}

interface SearchFiltersProps {
  categories: ServiceCategory[];
  initial: SearchFilterValues;
  /** Geo currently applied to the results (from the URL). */
  currentGeo: { lat: number; lng: number } | null;
}

const inputClasses =
  "w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-600";

/** Sidebar filters → rebuilds /search query params on apply. */
export default function SearchFilters({ categories, initial, currentGeo }: SearchFiltersProps) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const { requestLocation, clearLocation, status } = useGeolocation();

  const set = (key: keyof SearchFilterValues) => (value: string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setInput = (key: keyof SearchFilterValues) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const buildParams = (
    next: SearchFilterValues,
    geo: { lat: number; lng: number } | null | undefined,
  ) => {
    const params = new URLSearchParams();
    params.set("tab", next.tab);
    if (next.category) params.set("category", next.category);
    if (next.pricingModel) params.set("pricingModel", next.pricingModel);
    if (next.minPrice) params.set("minPrice", next.minPrice);
    if (next.maxPrice) params.set("maxPrice", next.maxPrice);
    if (next.rating) params.set("rating", next.rating);
    if (next.radius) params.set("radius", next.radius);
    // undefined = keep current geo; null = drop it.
    const effective = geo === undefined ? currentGeo : geo;
    if (effective) {
      params.set("lat", String(effective.lat));
      params.set("lng", String(effective.lng));
    }
    return params.toString();
  };

  const apply = () => router.push(`/search?${buildParams(values, undefined)}`);

  const switchTab = (tab: "services" | "pros") => {
    const next = { ...values, tab };
    setValues(next);
    router.push(`/search?${buildParams(next, undefined)}`);
  };

  const useMyLocation = () => {
    requestLocation();
    const started = Date.now();
    const timer = setInterval(() => {
      try {
        const raw = window.localStorage.getItem("bw:geo");
        if (raw) {
          const cached = JSON.parse(raw) as { latitude: number; longitude: number; timestamp: number };
          if (Date.now() - cached.timestamp < 60_000) {
            clearInterval(timer);
            router.push(
              `/search?${buildParams(values, { lat: cached.latitude, lng: cached.longitude })}`,
            );
          }
        }
      } catch {
        // ignore
      }
      if (Date.now() - started > 15_000) clearInterval(timer);
    }, 500);
  };

  const dropLocation = () => {
    clearLocation();
    router.push(`/search?${buildParams(values, null)}`);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
      {/* Tabs */}
      <div className="flex gap-2 bg-gray-50 p-1.5 rounded-xl">
        {(["services", "pros"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => switchTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
              values.tab === tab ? "bg-gray-900 text-white shadow" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <label className="block">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</span>
        <div className="mt-1 w-full">
          <StyledSelect
            value={values.category}
            onChange={set("category")}
            options={[
              { value: "", label: "All categories" },
              ...categories.map((c) => ({
                value: c._id ?? "",
                label: c.displayName,
              })),
            ]}
            aria-label="Category"
            className="w-full"
            triggerClassName="px-4 py-3 rounded-xl"
          />
        </div>
      </label>

      {values.tab === "services" && (
        <label className="block">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pricing</span>
          <div className="mt-1 w-full">
            <StyledSelect
              value={values.pricingModel}
              onChange={set("pricingModel")}
              options={[
                { value: "", label: "Any" },
                { value: "fixed", label: "Fixed" },
                { value: "hourly", label: "Hourly" },
                { value: "contract", label: "Contract" },
              ]}
              aria-label="Pricing model"
              className="w-full"
              triggerClassName="px-4 py-3 rounded-xl"
            />
          </div>
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min ₦</span>
          <input value={values.minPrice} onChange={setInput("minPrice")} type="number" min={0} placeholder="0" className={`${inputClasses} mt-1`} />
        </label>
        <label className="block">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max ₦</span>
          <input value={values.maxPrice} onChange={setInput("maxPrice")} type="number" min={0} placeholder="Any" className={`${inputClasses} mt-1`} />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Min rating</span>
        <div className="mt-1 w-full">
          <StyledSelect
            value={values.rating}
            onChange={set("rating")}
            options={[
              { value: "", label: "Any" },
              { value: "4.5", label: "4.5+" },
              { value: "4", label: "4.0+" },
              { value: "3", label: "3.0+" },
            ]}
            aria-label="Minimum rating"
            className="w-full"
            triggerClassName="px-4 py-3 rounded-xl"
          />
        </div>
      </label>

      <label className="block">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Radius (km)</span>
        <div className="mt-1 w-full">
          <StyledSelect
            value={values.radius}
            onChange={set("radius")}
            options={[
              { value: "5", label: "5 km" },
              { value: "10", label: "10 km" },
              { value: "25", label: "25 km" },
              { value: "50", label: "50 km" },
            ]}
            aria-label="Search radius"
            className="w-full"
            triggerClassName="px-4 py-3 rounded-xl"
          />
        </div>
      </label>

      <button
        onClick={useMyLocation}
        disabled={status === "locating"}
        className="w-full flex items-center justify-center gap-2 py-3 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all disabled:opacity-50"
      >
        <HugeiconsIcon icon={Navigation03Icon} size={16} />
        {status === "locating" ? "Locating…" : currentGeo ? "Location on — update" : "Use my location"}
      </button>
      {currentGeo && (
        <button onClick={dropLocation} className="w-full text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors">
          Clear location filter
        </button>
      )}

      <button
        onClick={apply}
        className="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
      >
        Apply filters
      </button>
    </div>
  );
}
