import React from "react";
import Image from "next/image";

interface ServiceGalleryProps {
    images: string[];
}

export default function ServiceGallery({ images }: ServiceGalleryProps) {
    return (
        <div className="w-full h-[12rem] md:h-[18rem] rounded-[1.5rem] overflow-hidden relative bg-gray-100 mb-6">
            {images.length > 0 ? (
                <Image
                    src={images[0]}
                    alt="Service Main"
                    fill
                    className="object-cover"
                    priority
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
        </div>
    );
}
