"use client";
import React from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

interface Service {
  name: string;
  image: string;
  sections: string[];
  category: string;
}

interface Props {
  services: Service[];
  onSelect: (service: Service) => void;
  selected: Service | null;
}

export default function ServicesCarousel({ services, onSelect, selected }: Props) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 6.5,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 2, spacing: 12 },
      },
      "(max-width: 480px)": {
        slides: { perView: 1.5, spacing: 10 },
      },
    },
  });

  return (
    <div className="relative w-full hidden lg:block mt-[2.6rem]">
      <div ref={sliderRef} className="keen-slider">
        {services.map((service) => (
          <div key={service.name} className="keen-slider__slide flex justify-center">
            <ServiceCard
              service={service}
              selected={selected?.name === service.name}
              onClick={() => onSelect(service)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  selected,
  onClick,
}: {
  service: Service;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-[11rem] h-[7rem] rounded-[1.25rem] overflow-hidden cursor-pointer bg-cover bg-center flex-shrink-0 transition-all duration-200 ${
        selected ? "outline outline-2 outline-primary" : "outline-none"
      }`}
      style={{ backgroundImage: `url(${service.image})` }}
    >
      <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from- dark/60 to-transparent" />
      <span
        className={`absolute bottom-2 left-4 font-bold text-[.8rem] ${
          selected ? "text-white" : "text-gray-text2"
        }`}
      >
        {service.name}
      </span>
    </div>
  );
}
