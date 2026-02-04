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
    <div className="flex flex-wrap items-center gap-3 py-2">
      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
        Active Filters
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {activeFilters.map((filter) => (
          <div
            key={filter}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100/50 rounded-lg group animate-in zoom-in duration-300"
          >
            <span className="text-[11px] font-bold text-indigo-600">{filter}</span>
            <button
              onClick={() => handleDelete(filter)}
              className="p-0.5 hover:bg-indigo-100 rounded-md transition-colors"
              aria-label={`Remove ${filter} filter`}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} className="text-indigo-400 group-hover:text-indigo-600" />
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

