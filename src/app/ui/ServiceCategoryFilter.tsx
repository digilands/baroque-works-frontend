import { Chip } from "@mui/material";
import React, { useState } from "react";
interface ServiceCategoryFilterProps {
  sections: string[]
  onChange: (subcat:string) => void
}
export default function ServiceCategoryFilter({sections, onChange}: ServiceCategoryFilterProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);

  function handleClick(index: number) {
    setSelectedSection(index);
    onChange(sections[index])

  }
  return <div className="flex flex-row gap-[.5rem] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-l-[.1rem] border-l-[#6B6B6B] pl-[.5rem] md:border-l-0 ">
    {sections.map((section, index) => {
      return (
        <Chip label={section} key={index} className={`${selectedSection === index ? "bg-dark text-white-bg" : "text-gray-text3 bg-bg"} `} onClick={() => handleClick(index)}/>
          
      )
    })}
  </div>;
}
