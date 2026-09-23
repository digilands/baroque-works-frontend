"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGeolocation } from "@/hooks/useGeolocation";

const ATTEMPTED_KEY = "bw:home-location-attempted";

export default function HomeLocationInitializer({
  category,
  radius,
  geoActive,
}: {
  category?: string;
  radius: number;
  geoActive: boolean;
}) {
  const router = useRouter();
  const { position, status, requestLocation } = useGeolocation();

  useEffect(() => {
    if (geoActive) return;

    if (position) {
      // Preserve every existing query param (category, filters, tabs…).
      const params = new URLSearchParams(window.location.search);
      params.set("lat", String(position.latitude));
      params.set("lng", String(position.longitude));
      if (!params.has("radius")) params.set("radius", String(radius));
      if (category && !params.has("category")) params.set("category", category);
      router.replace(`/home?${params.toString()}`);
      return;
    }

    if (status !== "idle" && status !== "granted") return;
    if (window.sessionStorage.getItem(ATTEMPTED_KEY)) return;

    window.sessionStorage.setItem(ATTEMPTED_KEY, "1");
    requestLocation();
  }, [category, geoActive, position, radius, requestLocation, router, status]);

  return null;
}
