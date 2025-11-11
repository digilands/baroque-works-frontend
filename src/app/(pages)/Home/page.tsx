'use client'
import { useState } from "react";
import ServicesCarousel from "../../ui/ServicesCarousel";
import ServicesSection from "../../ui/ServicesSection";
import { services } from "@/utils/data";

export default function HomePage() {

 const [selected, setSelected] = useState(services[0]);
  return <div>  <ServicesCarousel
        services={services}
        selected={selected}
        onSelect={(service) => setSelected(service)}
      />
      <div className="mt-6">
       <ServicesSection service={selected} />
      </div></div>;
}
