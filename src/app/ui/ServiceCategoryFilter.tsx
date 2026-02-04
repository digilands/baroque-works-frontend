"use client";

import React, { useState } from "react";

interface ServiceCategoryFilterProps {
  sections: string[];
  onChange: (subcat: string) => void;
}

export default function ServiceCategoryFilter({ sections, onChange }: ServiceCategoryFilterProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);

  function handleClick(index: number) {
    setSelectedSection(index);
    onChange(sections[index]);
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
      {sections.map((section, index) => {
        const isSelected = selectedSection === index;
        return (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 border-2 ${
              isSelected 
                ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-200" 
                : "bg-gray-50 border-gray-50 text-gray-500 hover:border-gray-200 hover:text-gray-900"
            }`}
          >
            {section}
          </button>
        );
      })}
    </div>
  );
}
