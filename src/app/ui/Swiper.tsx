"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
const services = [
  { title: "House Section", image: "/illustrations/houseIcon.png" },
  { title: "Plumbing", image: "/illustrations/plumbingIcon.png" },
  { title: "General Maintenance", image: "/illustrations/gmIcon.png" },
  { title: "Carpentry", image: "/illustrations/carpentryIcon.png" },
  { title: "Electrical Work", image: "/illustrations/electricalIcon.png" },
  { title: "House Section", image: "/illustrations/houseIcon.png" },
  { title: "Plumbing", image: "/illustrations/plumbingIcon.png" },
  { title: "General Maintenance", image: "/illustrations/gmIcon.png" },
  { title: "Carpentry", image: "/illustrations/carpentryIcon.png" },
  { title: "Electrical Work", image: "/illustrations/electricalIcon.png" },

];

export default function VerticalCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col items-center">
     
      <img
        src={services[activeIndex].image}
        alt={services[activeIndex].title}
        className="h-[12rem] w-[12rem] object-contain mb-[-4rem] transition-all duration-700 ease-in-out"
      />

   
      <Swiper
        direction="vertical"
        slidesPerView={5}
        loop={true}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[Autoplay]}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-[20rem] w-[70%] select-none "
      >
        {services.map((service, idx) => {
              const diff = Math.abs(idx - activeIndex);
          const scale =
            diff === 0 ? "scale-125" : diff === 1 ? "scale-110" : "scale-95";
         
           const textSize =
            diff === 0 ? "text-[2.5rem]" : diff === 1 ? "text-[1.5rem] " : "text-base";
           
            const color =
            diff === 0 ? "text-[#5B5B5B]" : diff === 1 ? "text-[#8F8F8F]" : "text-[#A4A4A4]";

              const translateX =
            diff === 0
              ? "translate-x-0 pb-[8rem]"
              : diff === 1
              ? "translate-x-12"
              : "translate-x-24";

              const imgSize = diff === 0 ? 60 : diff === 1 ? 35 : 20;

            return (
          <SwiperSlide key={idx}>
            <div
                className={`flex flex-row items-center float-right pr-30 transition-all duration-700 ease-in-out ${scale} ${translateX} `}
              >
                <img src={service.image} alt={service.title} width={imgSize} height={imgSize} />
                <p
                  className={` transition-all duration-700 ease-in-out ${textSize} ${color}`}
                >
                  {service.title}
                </p>
              </div>
          </SwiperSlide>)
})}
      </Swiper>
    </div>
  );
}
