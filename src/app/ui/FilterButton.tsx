"use client";

import React from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon } from '@hugeicons/core-free-icons';

interface FilterButtonProps {
  numberOfFilters: number;
}

export default function FilterButton({ numberOfFilters }: FilterButtonProps) {
  return (
    <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm group">
      <HugeiconsIcon 
        icon={FilterIcon} 
        size={18} 
        className="text-gray-400 group-hover:text-indigo-600 transition-colors" 
      />
      <span className="text-sm font-bold text-gray-700">Filter</span>
      {numberOfFilters > 0 && (
        <span className="ml-1 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
          {numberOfFilters}
        </span>
      )}
    </button>
  );
}
