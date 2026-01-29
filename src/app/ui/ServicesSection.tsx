import React, { useEffect, useState } from "react";
import ActiveFilters from "./ActiveFilters";
import FilterButton from "./FilterButton";
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon } from '@hugeicons/core-free-icons';
import ServiceCategoryFilter from "./ServiceCategoryFilter";
import Card from "./Card";
import { handymen } from "@/utils/data";

interface ServicesSectionProps {
  service: {
    name: string;
    sections: string[];
    category: string;
  }
}





export default function ServicesSection({ service }: ServicesSectionProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([
    "Available",
    "Hourly Rate",
    "Fixed Rate",
  ]);

  const [category, setCategory] = useState<typeof handymen>([]);

  useEffect(() => {
    const filtered = handymen.filter((item) => item.category === service.category)
    setCategory(filtered);
  }, [service.category])

  const handleDelete = (prop: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== prop))
  };

  const handleSubCategoryChange = (subcat: string) => {
    const filtered = handymen.filter((item) => item.category === service.category)
    if (subcat === "All") {
      setCategory(filtered);
    } else {
      const trimmed = subcat.trim().toLowerCase()
      const updated = filtered.filter((item) => item.subcategory === trimmed);
      setCategory(updated);
    }
  }

  return <div>
    <div className='flex flex-row gap-[.5rem] items-end w-fit mb-[1.2rem] mt-[.5rem] md:mb-none md:mt-none'>
      <h2 className='text-[1rem] md:text-[1.7rem] leading-none md:font-semibold'>{service.name}</h2>
      <p className=" text-[.75rem] text-gray-text1 md:text-text md:text-[1rem] leading-none">{`${category.length} results`}</p>
    </div>
    <div className="flex flex-row-reverse md:flex-row items-center justify-between mb-[.5rem]  gap-[.5rem]">
      <ServiceCategoryFilter sections={service.sections} onChange={handleSubCategoryChange} />
      <div className="hidden md:block">
        <FilterButton numberOfFilters={activeFilters.length} />
      </div>
      <div className="block md:hidden">
        <HugeiconsIcon icon={FilterIcon} />
      </div>
    </div>
    <ActiveFilters activeFilters={activeFilters} handleDelete={handleDelete} />

    {/* data */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4  gap-[1.3rem] mt-4">
      {category
        .map((item) => <Card key={item.id} {...item} />)}
    </div>
  </div>;
}