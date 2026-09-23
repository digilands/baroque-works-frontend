"use client";

import React, { memo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import StarIcon from "@hugeicons/core-free-icons/StarIcon";
import Location01Icon from "@hugeicons/core-free-icons/Location01Icon";
import Card from "@/app/ui/Card";
import type { MapPin } from "@/components/ui/MapboxMap";
import type { ProCardData, ServiceCardData } from "@/lib/server/mappers";
import { isUnoptimizedSrc, normalizeImageSrc } from "@/lib/images";

const MapboxMap = dynamic(() => import("@/components/ui/MapboxMap"), { ssr: false });
const HireModal = dynamic(() => import("@/app/ui/search/HireModal"), { ssr: false });

interface SearchResultsProps {
  tab: "services" | "pros";
  serviceCards: ServiceCardData[];
  pros: ProCardData[];
  pins: MapPin[];
  mapCenter: { latitude: number; longitude: number };
  /** Services feed demanded a session — prompt sign-in on the services tab. */
  servicesUnauthorized?: boolean;
  /** Job posting the user is hiring for — pros cards gain a Hire action. */
  hireFor?: string;
}

const FALLBACK_AVATAR = "https://placehold.co/100x100?text=BW";

const ProCard = memo(function ProCard({ pro, hireFor, onHire }: { pro: ProCardData; hireFor?: string; onHire?: (pro: ProCardData) => void }) {
  const avatarSrc = normalizeImageSrc(pro.avatar, FALLBACK_AVATAR);
  return (
    <Link
      href={`/search?tab=services&handymanId=${pro.id}`}
      className="group bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all block"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0">
          <Image
            src={avatarSrc}
            alt={pro.name}
            fill
            sizes="56px"
            className="rounded-full object-cover border border-gray-100"
            unoptimized={isUnoptimizedSrc(avatarSrc)}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
            {pro.name}
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            {pro.experience} · {pro.jobsCompleted} jobs done
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <HugeiconsIcon icon={StarIcon} size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-gray-700">{pro.rating.toFixed(1)}</span>
        </div>
      </div>
      {(pro.locationLabel || pro.distance) && (
        <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 font-medium">
          <HugeiconsIcon icon={Location01Icon} size={14} />
          <span className="truncate">
            {[pro.locationLabel, pro.distance].filter(Boolean).join(" · ")}
          </span>
        </div>
      )}
      {hireFor && onHire && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onHire(pro);
          }}
          className="mt-4 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
        >
          Hire for this job
        </button>
      )}
    </Link>
  );
});

/** Tabbed results grid with an optional pros map view. */
export default function SearchResults({ tab, serviceCards, pros, pins, mapCenter, servicesUnauthorized, hireFor }: SearchResultsProps) {
  const [showMap, setShowMap] = useState(false);
  const [hirePro, setHirePro] = useState<ProCardData | null>(null);
  const items = tab === "services" ? serviceCards : pros;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 font-medium">
          {items.length} result{items.length === 1 ? "" : "s"}
        </p>
        {tab === "pros" && pins.length > 0 && (
          <button
            onClick={() => setShowMap((v) => !v)}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {showMap ? "Hide map" : "Show map"}
          </button>
        )}
      </div>

      {tab === "pros" && showMap && (
        <MapboxMap center={mapCenter} zoom={11} pins={pins} className="h-80 w-full border border-gray-100" />
      )}

      {items.length === 0 ? (
        tab === "services" && servicesUnauthorized ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Sign in to browse services</h3>
            <p className="text-sm text-gray-400 mb-6">Service listings are available to members.</p>
            <Link
              href="/auth/login"
              className="inline-block px-6 py-3 bg-gray-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all"
            >
              Sign in
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">No results</h3>
            <p className="text-sm text-gray-400">Try widening the radius or clearing filters.</p>
          </div>
        )
      ) : tab === "services" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {(items as ServiceCardData[]).map((card) => (
            <Card key={card.id} {...card} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(items as ProCardData[]).map((pro) => (
            <ProCard key={pro.id} pro={pro} hireFor={hireFor} onHire={setHirePro} />
          ))}
        </div>
      )}

      {hireFor && hirePro && (
        <HireModal
          open
          onClose={() => setHirePro(null)}
          jobId={hireFor}
          handymanId={hirePro.id}
          handymanName={hirePro.name}
        />
      )}
    </div>
  );
}
