"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ServicesGrid from "./ServicesGrid";
import HomeFilters, {
  EMPTY_FEED_FILTERS,
  FeedChips,
  FilterButton,
  countActiveFilters,
  type FeedChip,
  type FeedFilterValues,
} from "./HomeFilters";
import { mapServiceItemToCard } from "@/lib/server/mappers";
import { internalApi } from "@/lib/auth";
import type { ProfessionSubCategory, ServiceFeedItem } from "@/lib/server/queries";
import type { ServiceCardData } from "@/lib/server/mappers";

interface HomeServicesGridProps {
  title: string;
  subtitle?: string;
  cards: ServiceCardData[];
  authGated: boolean;
  params: {
    category?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
    limit: number;
  };
  nearby?: { latitude: number; longitude: number; radius: number; category: string };
  /** Subcategory tabs — only set when a category tile is selected. */
  subcategories?: ProfessionSubCategory[];
  /** Category id/code from the URL — client-side filter when items carry `category`. */
  categoryId?: string;
}

function parseNumber(value: string): number | null {
  if (value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function matchesFilters(card: ServiceCardData, f: FeedFilterValues): boolean {
  if (f.pricingModel && card.rateType !== f.pricingModel) return false;
  const min = parseNumber(f.minPrice);
  const max = parseNumber(f.maxPrice);
  if (min !== null && (card.priceValue ?? 0) < min) return false;
  if (max !== null && (card.priceValue ?? 0) > max) return false;
  const minRating = parseNumber(f.rating);
  if (minRating !== null && card.profile.rating < minRating) return false;
  const radiusKm = parseNumber(f.radius);
  if (radiusKm !== null && card.distanceMeters != null) {
    if (card.distanceMeters > radiusKm * 1000) return false;
  }
  return true;
}

function matchesSubcategory(
  card: ServiceCardData,
  subId: string,
  subName: string,
): boolean {
  if (!card.subCategory) return true;
  return card.subCategory === subId || card.subCategory === subName;
}

export default function HomeServicesGrid({
  title,
  subtitle,
  cards: initialCards,
  authGated: initialAuthGated,
  params,
  nearby,
  subcategories = [],
  categoryId,
}: HomeServicesGridProps) {
  const [cards, setCards] = useState(initialCards);
  const [authGated, setAuthGated] = useState(initialAuthGated);
  const [retrying, setRetrying] = useState(initialAuthGated);
  const [filters, setFilters] = useState<FeedFilterValues>(EMPTY_FEED_FILTERS);
  const [draft, setDraft] = useState<FeedFilterValues>(EMPTY_FEED_FILTERS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeSub, setActiveSub] = useState(""); // "" = All
  const panelRef = useRef<HTMLDivElement>(null);
  const { category, latitude, longitude, radius, limit } = params;

  useEffect(() => {
    if (!initialAuthGated) return;

    let cancelled = false;
    internalApi
      .get<{ items?: ServiceFeedItem[] }>("/services", {
        params: { category, latitude, longitude, radius, limit },
      })
      .then(({ data }) => {
        if (cancelled) return;
        setCards(Array.isArray(data.items) ? data.items.map(mapServiceItemToCard) : []);
        setAuthGated(false);
      })
      .catch((error: { status?: number; response?: { status?: number } }) => {
        if (cancelled) return;
        setAuthGated(error.status === 401 || error.response?.status === 401);
      })
      .finally(() => {
        if (!cancelled) setRetrying(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, initialAuthGated, latitude, limit, longitude, radius]);

  useEffect(() => {
    if (!panelOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [panelOpen]);

  const activeSubName =
    activeSub === ""
      ? ""
      : (subcategories.find((s) => s._id === activeSub)?.displayName ?? activeSub);

  const filtered = useMemo(() => {
    let list = cards;
    if (categoryId) {
      const tagged = list.filter((c) => c.category);
      if (tagged.length > 0) {
        list = list.filter((c) => c.category === categoryId);
      }
    }
    if (activeSub !== "") {
      list = list.filter((c) => matchesSubcategory(c, activeSub, activeSubName));
    }
    return list.filter((c) => matchesFilters(c, filters));
  }, [activeSub, activeSubName, cards, categoryId, filters]);

  const activeCount = countActiveFilters(filters);

  const chips: FeedChip[] = [];
  if (filters.pricingModel) {
    chips.push({
      key: "pricing",
      label: filters.pricingModel.charAt(0).toUpperCase() + filters.pricingModel.slice(1),
      onRemove: () => {
        const next = { ...filters, pricingModel: "" };
        setFilters(next);
        setDraft(next);
      },
    });
  }
  if (filters.minPrice) {
    chips.push({
      key: "min",
      label: `Min ₦${filters.minPrice}`,
      onRemove: () => {
        const next = { ...filters, minPrice: "" };
        setFilters(next);
        setDraft(next);
      },
    });
  }
  if (filters.maxPrice) {
    chips.push({
      key: "max",
      label: `Max ₦${filters.maxPrice}`,
      onRemove: () => {
        const next = { ...filters, maxPrice: "" };
        setFilters(next);
        setDraft(next);
      },
    });
  }
  if (filters.rating) {
    chips.push({
      key: "rating",
      label: `${filters.rating}+ rating`,
      onRemove: () => {
        const next = { ...filters, rating: "" };
        setFilters(next);
        setDraft(next);
      },
    });
  }
  if (filters.radius) {
    chips.push({
      key: "radius",
      label: `Within ${filters.radius}km`,
      onRemove: () => {
        const next = { ...filters, radius: "" };
        setFilters(next);
        setDraft(next);
      },
    });
  }

  const showTabs = subcategories.length > 0;

  return (
    <div className="relative">
      <div className="relative flex items-center gap-3 mb-4" ref={panelRef}>
        {/* Mobile: black icon button on the left (matches mobile mock) */}
        <div className="order-1 md:hidden shrink-0">
          <FilterButton
            variant="icon"
            count={activeCount}
            open={panelOpen}
            onClick={() => setPanelOpen((v) => !v)}
          />
        </div>

        <span aria-hidden="true" className="order-2 md:hidden w-px h-8 bg-gray-300 shrink-0" />

        {showTabs && (
          <div
            role="tablist"
            aria-label="Subcategories"
            className="order-3 md:order-1 flex items-center gap-1 min-w-0 flex-1 overflow-x-auto no-scrollbar pb-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeSub === ""}
              onClick={() => setActiveSub("")}
              className={`px-5 py-2.5 rounded-full text-[15px] transition-all shrink-0 whitespace-nowrap ${
                activeSub === ""
                  ? "bg-gray-900 text-white font-bold"
                  : "text-gray-500 font-medium hover:text-gray-900"
              }`}
            >
              All
            </button>
            {subcategories.map((s) => {
              const id = s._id ?? "";
              const selected = activeSub === id;
              return (
                <button
                  key={id || s.displayName}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveSub(id)}
                  className={`px-3 py-2.5 rounded-full text-[15px] transition-all shrink-0 whitespace-nowrap ${
                    selected
                      ? "bg-gray-900 text-white font-bold"
                      : "text-gray-500 font-medium hover:text-gray-900"
                  }`}
                >
                  {s.displayName}
                </button>
              );
            })}
          </div>
        )}

        {/* Desktop: white pill button on the right (matches desktop mock) */}
        <div className="order-2 hidden md:block shrink-0 ml-auto">
          <FilterButton
            variant="pill"
            count={activeCount}
            open={panelOpen}
            onClick={() => setPanelOpen((v) => !v)}
          />
        </div>

        {panelOpen && (
          <HomeFilters
            draft={draft}
            onDraftChange={setDraft}
            onApply={() => {
              setFilters(draft);
              setPanelOpen(false);
            }}
            onClear={() => {
              setDraft(EMPTY_FEED_FILTERS);
              setFilters(EMPTY_FEED_FILTERS);
              setPanelOpen(false);
            }}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </div>

      <FeedChips chips={chips} total={activeCount} />

      <ServicesGrid
        title={title}
        subtitle={subtitle}
        cards={filtered}
        authGated={authGated}
        loading={retrying}
        nearby={nearby}
        totalLoaded={cards.length}
        filtersActive={activeCount > 0 || activeSub !== "" || Boolean(categoryId)}
        onClearFilters={() => {
          setFilters(EMPTY_FEED_FILTERS);
          setDraft(EMPTY_FEED_FILTERS);
          setActiveSub("");
        }}
      />
    </div>
  );
}
