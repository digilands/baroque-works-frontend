"use client";

import React, { useEffect, useState } from "react";
import ActiveFilters from "./ActiveFilters";
import FilterButton from "./FilterButton";
import { HugeiconsIcon } from '@hugeicons/react';
import FilterIcon from '@hugeicons/core-free-icons/FilterIcon';
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
    "4.0 +",
    "$24 - $100",
    "Hourly rate",
    "Fixed rate"
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      {/* Header Area */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-6">
          <h2 className="text-[28px] font-bold text-gray-900 tracking-tight">{service.name}</h2>
          <span className="text-[15px] text-gray-500 font-medium">{category.length} result</span>
        </div>
        
        {/* Categories */}
        <div className="mb-6 overflow-hidden">
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
             <ServiceCategoryFilter sections={service.sections} onChange={handleSubCategoryChange} />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar">
            <ActiveFilters activeFilters={activeFilters} handleDelete={handleDelete} />
          </div>
          
          <div className="shrink-0 ml-auto">
            <FilterButton numberOfFilters={5} />
          </div>
        </div>
      </div>

      {/* Grid */}
      {category.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {category.map((item) => (
            <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card {...item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <HugeiconsIcon icon={FilterIcon} size={40} className="text-gray-200" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No handymen found</h3>
          <p className="text-gray-400 max-w-sm">
            We couldn't find any handymen matching your current filters. Try adjusting your selection.
          </p>
        </div>
      )}
    </div>
  );
}
