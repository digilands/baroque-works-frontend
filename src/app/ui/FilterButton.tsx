"use client";

import React from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import FilterIcon from '@hugeicons/core-free-icons/FilterIcon';

interface FilterButtonProps {
  numberOfFilters: number;
}

export default function FilterButton({ numberOfFilters }: FilterButtonProps) {
  return (
    <button className="flex items-center gap-2.5 px-5 py-2.5 bg-white border border-gray-100 rounded-full hover:bg-gray-50 transition-all shadow-sm group">
      <HugeiconsIcon 
        icon={FilterIcon} 
        size={18} 
        className="text-gray-500 group-hover:text-gray-900 transition-colors" 
      />
      <span className="text-[15px] font-medium text-gray-700 group-hover:text-gray-900">Filter</span>
      {numberOfFilters > 0 && (
        <span className="ml-1 w-5 h-5 bg-gray-100 text-gray-900 border border-gray-200 text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
          {numberOfFilters}
        </span>
      )}
    </button>
  );
}
