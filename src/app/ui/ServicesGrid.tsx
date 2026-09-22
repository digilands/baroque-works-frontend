import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from '@hugeicons/react';
import FilterIcon from '@hugeicons/core-free-icons/FilterIcon';
import Card from "./Card";
import type { ServiceCardData } from "@/lib/server/mappers";

interface ServicesGridProps {
  title: string;
  subtitle?: string;
  cards: ServiceCardData[];
  /** Backend demanded a session: prompt sign-in instead of an empty grid. */
  authGated?: boolean;
  loading?: boolean;
  nearby?: { latitude: number; longitude: number; radius: number; category: string };
}

export default function ServicesGrid({ title, subtitle, cards, authGated, loading, nearby }: ServicesGridProps) {
  const nextRadius = nearby ? Math.min(Math.max(nearby.radius * 2, 25), 100) : 0;
  const canExpandRadius = Boolean(nearby && nextRadius > nearby.radius);
  const expandedParams = nearby
    ? new URLSearchParams({
        lat: String(nearby.latitude),
        lng: String(nearby.longitude),
        radius: String(nextRadius),
        ...(nearby.category ? { category: nearby.category } : {}),
      })
    : null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">{title}</h2>
          <span className="text-[15px] text-gray-500 font-medium">
            {cards.length} result{cards.length === 1 ? "" : "s"}
          </span>
          {subtitle && (
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div role="status" className="py-20 text-center text-sm font-medium text-gray-500">
          Reconnecting to your session…
        </div>
      ) : cards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cards.map((item) => (
            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card {...item} />
            </div>
          ))}
        </div>
      ) : authGated ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Sign in to browse services</h3>
          <p className="text-gray-400 max-w-sm mb-8">
            Service listings are available to members. Log in to see pros near you.
          </p>
          <Link
            href="/auth/login"
            className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
          >
            Sign in
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <HugeiconsIcon icon={FilterIcon} size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-400 max-w-sm">
            {nearby
              ? `There are no services within ${nearby.radius}km yet. Try increasing your search radius to find more providers.`
              : "We couldn't find any services in this category yet. Try another category."}
          </p>
          {canExpandRadius && expandedParams && (
            <Link
              href={`/home?${expandedParams.toString()}`}
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
            >
              Search within {nextRadius}km
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
