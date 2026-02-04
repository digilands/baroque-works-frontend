"use client";

import React from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface ActiveFiltersProps {
  activeFilters: string[];
  handleDelete: (filter: string) => void;
}

export default function ActiveFilters({ activeFilters, handleDelete }: ActiveFiltersProps) {
  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 py-2">
      <span className="text-sm font-medium text-gray-500">Active filters</span>
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full group animate-in zoom-in duration-300"
          >
            <span className="text-[13px] font-medium text-gray-900">{filter}</span>
            <button
              onClick={() => handleDelete(filter)}
              className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={`Remove ${filter} filter`}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} className="text-gray-400 group-hover:text-gray-900" />
            </button>
          </div>
        ))}
        {activeFilters.length > 0 && (
           <button 
             onClick={() => activeFilters.forEach(f => handleDelete(f))}
             className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-tight ml-2"
           >
             Clear All
           </button>
        )}
      </div>
    </div>
  );
}

