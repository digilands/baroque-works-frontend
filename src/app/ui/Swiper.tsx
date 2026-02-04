"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";

const slides = [
  { title: "House Section", image: "/illustrations/houseIcon.png" },
  { title: "Plumbing", image: "/illustrations/plumbingIcon.png" },
  { title: "General Maintenance", image: "/illustrations/gmIcon.png" },
  { title: "Carpentry", image: "/illustrations/carpentryIcon.png" },
  { title: "Electrical Work", image: "/illustrations/electricalIcon.png" },
];

export default function VerticalCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Repeat items for smoother loop
  const displayItems = [...slides, ...slides, ...slides];

  return (
    <div className="relative flex flex-col items-center justify-center h-[500px] w-full overflow-hidden">
      {/* Background Graphic Element */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-50 -z-10" />
      
      {/* Featured Large Image */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 transition-all duration-700 ease-out transform">
        <div className="relative w-64 h-64">
           {slides.map((slide, idx) => (
             <Image
               key={idx}
               src={slide.image}
               alt={slide.title}
               width={256}
               height={256}
               className={`absolute inset-0 object-contain transition-all duration-700 ${
                 idx === activeIndex % slides.length 
                   ? "opacity-100 scale-110 rotate-0 translate-x-0" 
                   : "opacity-0 scale-75 rotate-12 translate-x-20"
               }`}
             />
           ))}
        </div>
      </div>

      <Swiper
        direction="vertical"
        slidesPerView={5}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full select-none"
      >
        {displayItems.map((service, idx) => {
          const realIdx = idx % slides.length;
          const isActive = activeIndex === idx;
          const isNeighbor = Math.abs(activeIndex - idx) === 1;

          return (
            <SwiperSlide key={idx}>
              <div
                className={`flex items-center justify-end pr-12 transition-all duration-500 ease-out ${
                  isActive 
                    ? "scale-125 opacity-100 translate-x-0" 
                    : isNeighbor 
                      ? "scale-100 opacity-40 translate-x-8" 
                      : "scale-90 opacity-20 translate-x-16"
                }`}
              >
                <div className="flex items-center gap-6">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    width={isActive ? 48 : 32} 
                    height={isActive ? 48 : 32} 
                    className="transition-all duration-500"
                  />
                  <p
                    className={`font-bold transition-all duration-500 whitespace-nowrap ${
                      isActive 
                        ? "text-4xl text-gray-900" 
                        : "text-2xl text-gray-400"
                    }`}
                  >
                    {service.title}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
