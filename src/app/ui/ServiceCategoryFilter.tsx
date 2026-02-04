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
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[15px] font-medium transition-all duration-300 ${
              isSelected 
                ? "bg-black text-white" 
                : "bg-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {section}
          </button>
        );
      })}
    </div>
  );
}
