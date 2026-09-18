"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { HugeiconsIcon } from "@hugeicons/react";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import Location04Icon from "@hugeicons/core-free-icons/Location04Icon";
import type { MapCoords } from "./MapboxMap";

const MapboxMap = dynamic(() => import("./MapboxMap"), { ssr: false });

export interface PickedLocation extends MapCoords {
  label: string;
}

interface LocationPickerProps {
  initial?: MapCoords | null;
  onConfirm: (location: PickedLocation) => void;
  onCancel?: () => void;
}

interface GeocodeFeature {
  id: string;
  place_name: string;
  center: [number, number];
}

const LAGOS: MapCoords = { latitude: 6.5244, longitude: 3.3792 };

/** Map + place search for picking coordinates. Client-only (dynamic map). */
export default function LocationPicker({ initial, onConfirm, onCancel }: LocationPickerProps) {
  const [pin, setPin] = useState<MapCoords>(initial ?? LAGOS);
  const [label, setLabel] = useState("Pinned location");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodeFeature[]>([]);
  const [searching, setSearching] = useState(false);

  const searchPlaces = async (value: string) => {
    setQuery(value);
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (value.trim().length < 3 || !token) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${token}&country=NG&limit=5`,
      );
      const data = await res.json();
      setResults(data.features ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const selectPlace = (feature: GeocodeFeature) => {
    setPin({ latitude: feature.center[1], longitude: feature.center[0] });
    setLabel(feature.place_name);
    setResults([]);
    setQuery(feature.place_name);
  };

  const movePin = (coords: MapCoords) => {
    setPin(coords);
    setLabel("Pinned location");
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
          <HugeiconsIcon icon={Search01Icon} size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => searchPlaces(e.target.value)}
            placeholder="Search city, area, or landmark in Nigeria"
            className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-gray-400"
          />
        </div>
        {results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-20 max-h-56 overflow-y-auto">
            {results.map((f) => (
              <button
                key={f.id}
                onClick={() => selectPlace(f)}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <HugeiconsIcon icon={Location04Icon} size={16} className="text-gray-400 shrink-0" />
                <span className="truncate">{f.place_name}</span>
              </button>
            ))}
          </div>
        )}
        {searching && <p className="text-xs text-gray-400 mt-1">Searching…</p>}
      </div>

      {/* Map — tap to move the pin, or drag it */}
      <MapboxMap
        center={pin}
        zoom={13}
        draggablePin={pin}
        onDragPin={movePin}
        onMapClick={movePin}
        className="h-64 w-full border border-gray-100"
      />

      <p className="text-xs text-gray-500 font-medium">
        {label} · {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
      </p>

      <div className="flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 border border-gray-200 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => onConfirm({ ...pin, label })}
          className="flex-1 bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-black transition-all"
        >
          Confirm location
        </button>
      </div>
    </div>
  );
}
