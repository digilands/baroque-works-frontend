"use client";

import { useEffect, useState } from "react";
import ServicesGrid from "./ServicesGrid";
import { mapServiceItemToCard } from "@/lib/server/mappers";
import { internalApi } from "@/lib/auth";
import type { ServiceFeedItem } from "@/lib/server/queries";
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
}

export default function HomeServicesGrid({
  title,
  subtitle,
  cards: initialCards,
  authGated: initialAuthGated,
  params,
  nearby,
}: HomeServicesGridProps) {
  const [cards, setCards] = useState(initialCards);
  const [authGated, setAuthGated] = useState(initialAuthGated);
  const [retrying, setRetrying] = useState(initialAuthGated);
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

  return (
    <ServicesGrid
      title={title}
      subtitle={subtitle}
      cards={cards}
      authGated={authGated}
      loading={retrying}
      nearby={nearby}
    />
  );
}
