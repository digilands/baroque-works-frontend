import React from "react";
import Image from "next/image";

interface LocationMapProps {
    address: string;
}

export default function LocationMap({ address }: LocationMapProps) {
    return (
        <div className="w-full mt-6">
            <h3 className="text-text font-medium mb-1">Location</h3>
            <p className="text-gray-text1 text-xs mb-3">The location of the handyman is provided for services that require an in-person visit.</p>

            <div className="relative w-full h-[8rem] rounded-[1.25rem] overflow-hidden bg-gray-200 border border-[#E9E9E9]">
                {/* Using a placeholder static map image or we can use a real map integration later */}
                {/* For now, just a placeholder div visually representing a map */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#F2F4F7]">
                    <span className="text-gray-400 text-xs">Map View Placeholder</span>
                    <Image src="/map-placeholder.jpg" alt="Map" fill className="object-cover opacity-50" />
                </div>

                {/* Location Pin Card Overlay */}
                <div className="absolute bottom-2 left-2 right-2 bg-[var(--color-white-bg)] p-2 rounded-lg flex items-center gap-2 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-xs">📍</div>
                    <p className="text-text text-xs font-medium truncate">{address}</p>
                </div>
            </div>
        </div>
    );
}
