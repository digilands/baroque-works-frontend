import React from "react";
import Image from "next/image";
import { isUnoptimizedSrc, normalizeImageSrc } from "@/lib/images";

interface ServiceGalleryProps {
    images: string[];
}

export default function ServiceGallery({ images }: ServiceGalleryProps) {
    const mainSrc = images.length > 0 ? normalizeImageSrc(images[0]) : "";
    return (
        <div className="w-full h-[12rem] md:h-[18rem] rounded-[1.5rem] overflow-hidden relative bg-gray-100 mb-8 shadow-sm">
            {mainSrc ? (
                <Image
                    src={mainSrc}
                    alt="Service Main"
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    className="object-cover"
                    priority
                    unoptimized={isUnoptimizedSrc(mainSrc)}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
        </div>
    );
}
