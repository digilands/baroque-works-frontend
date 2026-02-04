"use client";

import React, { useEffect, useState } from "react";
import ActiveFilters from "./ActiveFilters";
import FilterButton from "./FilterButton";
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon, Sorting05Icon } from '@hugeicons/core-free-icons';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header & Meta */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">{service.name}</h2>
          <p className="text-sm font-medium text-gray-400">
            Showing <span className="text-gray-900 font-bold">{category.length}</span> specialized handymen in your area
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
             <HugeiconsIcon icon={Sorting05Icon} size={18} className="text-gray-400" />
             Sort by: Recommended
           </button>
        </div>
      </div>

      {/* Filters Area */}
      <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <ServiceCategoryFilter sections={service.sections} onChange={handleSubCategoryChange} />
          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
            <ActiveFilters activeFilters={activeFilters} handleDelete={handleDelete} />
            <div className="h-6 w-px bg-gray-100 mx-1 hidden md:block"></div>
            <FilterButton numberOfFilters={activeFilters.length} />
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
