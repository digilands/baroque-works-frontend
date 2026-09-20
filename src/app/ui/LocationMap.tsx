"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { MapPin } from "@/components/ui/MapboxMap";

const MapboxMap = dynamic(() => import("@/components/ui/MapboxMap"), { ssr: false });

interface LocationMapProps {
    address: string;
    coordinates?: [number, number];
}

export default function LocationMap({ address, coordinates }: LocationMapProps) {
    const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;
    const mapCenter = hasCoordinates
        ? { latitude: coordinates[1], longitude: coordinates[0] }
        : { latitude: 6.5244, longitude: 3.3792 };
    const pins: MapPin[] = hasCoordinates
        ? [{
            id: "handyman-location",
            latitude: coordinates[1],
            longitude: coordinates[0],
            label: address,
            image: "/handyman-logo.svg",
        }]
        : [];

    return (
        <div className="w-full mt-6">
            <h3 className="text-text font-medium mb-1">Location</h3>
            <p className="text-gray-text1 text-xs mb-3">The location of the handyman is provided for services that require an in-person visit.</p>

            <div className="relative w-full h-[8rem] rounded-[1.25rem] overflow-hidden bg-gray-200 border border-[#E9E9E9]">
                {hasCoordinates ? (
                    <MapboxMap center={mapCenter} zoom={13} pins={pins} className="h-full w-full rounded-none" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#E5E7EB] bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Location unavailable</span>
                    </div>
                )}

                {/* Location Pin Card Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-[var(--color-white-bg)] p-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs">📍</div>
                    <p className="text-text text-xs font-medium truncate">{address}</p>
                </div>
            </div>
        </div>
    );
}
