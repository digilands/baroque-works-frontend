"use client";

import React, { memo } from "react";
import Link from "next/link";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import type { CarouselItem } from "@/lib/server/mappers";

interface Props {
  items: CarouselItem[];
  selectedCategory: string;
}

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=BaroqueWorks";

export default function ServicesCarousel({ items, selectedCategory }: Props) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 6.5,
      spacing: 20,
    },
    breakpoints: {
      "(max-width: 1024px)": {
        slides: { perView: 4.5, spacing: 16 },
      },
      "(max-width: 768px)": {
        slides: { perView: 3.2, spacing: 12 },
      },
      "(max-width: 480px)": {
        slides: { perView: 2.2, spacing: 10 },
      },
    },
  });

  if (items.length === 0) return null;

  return (
    <div className="relative w-full py-8 overflow-hidden">
      <div ref={sliderRef} className="keen-slider !overflow-visible px-4">
        {items.map((service) => (
          <div key={service.category} className="keen-slider__slide">
            <ServiceCard
              service={service}
              selected={selectedCategory === service.category}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const ServiceCard = memo(function ServiceCard({
  service,
  selected,
}: {
  service: CarouselItem;
  selected: boolean;
}) {
  return (
    <Link
      href={`/home?category=${encodeURIComponent(service.category)}`}
      className={`group relative h-32 cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 border-2 block ${
        selected
          ? "border-indigo-600 ring-4 ring-indigo-50 shadow-lg scale-105 z-10"
          : "border-gray-50 hover:border-gray-100 hover:shadow-md"
      }`}
    >
      <Image
        src={service.image || FALLBACK_IMAGE}
        alt={service.name}
        fill
        className={`object-cover transition-transform duration-700 ${
          selected ? "scale-110" : "group-hover:scale-110"
        }`}
        unoptimized={service.image.includes("thispersondoesnotexist.com")}
      />

      {/* Overlay */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${
        selected
          ? "bg-indigo-600/40"
          : "bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80"
      }`} />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className={`text-xs font-bold transition-all duration-300 ${
          selected ? "text-white scale-110" : "text-white/90"
        }`}>
          {service.name}
        </p>
        {selected && (
           <div className="w-6 h-1 bg-white rounded-full mt-1 animate-in fade-in slide-in-from-left-1" />
        )}
      </div>
    </Link>
  );
});
