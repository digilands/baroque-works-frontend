"use client";

import { useCallback, useState } from "react";

export type GeoStatus =
  | "idle"
  | "locating"
  | "granted"
  | "denied"
  | "unsupported"
  | "error";

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

const STORAGE_KEY = "bw:geo";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

interface CachedGeo extends GeoPosition {
  timestamp: number;
}

function loadCached(): GeoPosition | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as CachedGeo;
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return {
      latitude: cached.latitude,
      longitude: cached.longitude,
      accuracy: cached.accuracy,
    };
  } catch {
    return null;
  }
}

function saveCached(position: GeoPosition) {
  try {
    const payload: CachedGeo = { ...position, timestamp: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Storage unavailable (private mode) — location still works for the session.
  }
}

/**
 * Browser geolocation with 24h localStorage caching.
 * Returns null until the user grants permission via `requestLocation()`.
 */
export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(loadCached);
  const [status, setStatus] = useState<GeoStatus>(() =>
    typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)
      ? "granted"
      : "idle",
  );

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: GeoPosition = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setPosition(next);
        setStatus("granted");
        saveCached(next);
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 300_000 },
    );
  }, []);

  const clearLocation = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setPosition(null);
    setStatus("idle");
  }, []);

  return { position, status, requestLocation, clearLocation };
}
