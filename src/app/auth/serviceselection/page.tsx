"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "../../ui/Button";
import { services } from "@/utils/data";
import { SubTitle, Title } from "@/app/ui/Titles";

export default function ServicesPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  const toggleService = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    console.log("Selected services:", selected);
   router.push("/auth/profilesetup");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen bg-bg text-text px-4">
      <Title>
        What Service Do you offer?
      </Title>
     <SubTitle>
        Select Services that you offer
      </SubTitle>

      <div className="grid grid-cols-2 gap-[1rem] max-w-md relative">
        {services.map((service, index) => {
          const isActive = selected.includes(index);
          return (
            <div
              key={index}
              onClick={() => toggleService(index)}
              className={`relative  w-[10rem] h-[6rem] cursor-pointer rounded-2xl overflow-hidden transition-all duration-300
                hover:scale-[1.03] ${
                  isActive
                    ? "ring-2 ring-black shadow-lg scale-[1.04]"
                    : "ring-1 ring-gray-300"
                }`}
            >
              <Image
                src={service.image}
                alt={service.name}
                width={200}
                height={100}
                className="object-cover w-full h-32"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <p className="absolute bottom-3 left-3 text-white text-sm font-medium drop-shadow">
                {service.name}
              </p>
            </div>
          );
        })}
        
      <Button
        onClick={handleNext}
        disabled={selected.length === 0}
        variant="primary"
        className=" w-32 absolute bottom-[-3.5rem] right-0"
      >
        Next
      </Button>
      </div>

    </div>
  );
}
