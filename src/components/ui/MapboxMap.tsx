"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  label?: string;
  /** Custom marker image — defaults to the handyman logo pin. */
  image?: string;
}

export interface MapCoords {
  latitude: number;
  longitude: number;
}

interface MapboxMapProps {
  center: MapCoords;
  zoom?: number;
  /** Display pins (handyman logo markers). */
  pins?: MapPin[];
  /** Movable selection pin (picker mode). */
  draggablePin?: MapCoords | null;
  onDragPin?: (coords: MapCoords) => void;
  onMapClick?: (coords: MapCoords) => void;
  className?: string;
}

const DEFAULT_PIN_IMAGE = "/handyman-logo.svg";

/**
 * Mapbox GL base map. Must be loaded with `ssr: false` (uses `window`).
 */
export default function MapboxMap({
  center,
  zoom = 12,
  pins = [],
  draggablePin,
  onDragPin,
  onMapClick,
  className = "h-72 w-full",
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const dragMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const callbacksRef = useRef({ onDragPin, onMapClick });

  // Sync latest callbacks without writing refs during render.
  useEffect(() => {
    callbacksRef.current = { onDragPin, onMapClick };
  }, [onDragPin, onMapClick]);

  // Init once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
      return;
    }
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [center.latitude ? center.longitude : 3.3792, center.latitude ? center.latitude : 6.5244],
      zoom,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    map.on("click", (e) => {
      callbacksRef.current.onMapClick?.({
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      });
    });
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recenter when the center changes.
  useEffect(() => {
    mapRef.current?.easeTo({
      center: [center.longitude, center.latitude],
      duration: 600,
    });
  }, [center.latitude, center.longitude]);

  // Display pins.
  useEffect(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    const map = mapRef.current;
    if (!map) return;
    for (const pin of pins) {
      const el = document.createElement("div");
      el.style.width = "36px";
      el.style.height = "36px";
      el.style.borderRadius = "9999px";
      el.style.overflow = "hidden";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
      el.style.background = "#fff";
      const img = document.createElement("img");
      img.src = pin.image ?? DEFAULT_PIN_IMAGE;
      img.alt = pin.label ?? "Handyman";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      el.appendChild(img);
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([pin.longitude, pin.latitude]);
      if (pin.label) marker.setPopup(new mapboxgl.Popup({ offset: 20 }).setText(pin.label));
      marker.addTo(map);
      markersRef.current.push(marker);
    }
  }, [pins]);

  // Draggable selection pin.
  const dragLat = draggablePin?.latitude;
  const dragLng = draggablePin?.longitude;
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (dragLat === undefined || dragLng === undefined) {
      dragMarkerRef.current?.remove();
      dragMarkerRef.current = null;
      return;
    }
    if (!dragMarkerRef.current) {
      const marker = new mapboxgl.Marker({ draggable: true, color: "#4F46E5" });
      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        callbacksRef.current.onDragPin?.({
          latitude: lngLat.lat,
          longitude: lngLat.lng,
        });
      });
      marker.addTo(map);
      dragMarkerRef.current = marker;
    }
    dragMarkerRef.current.setLngLat([dragLng, dragLat]);
  }, [dragLat, dragLng]);

  return <div ref={containerRef} className={`overflow-hidden rounded-2xl ${className}`} />;
}
