import React from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import { Chip } from "@mui/material";
interface props {
  activeFilters: string[],
  handleDelete: (filter: string) => void
}

export default function ActiveFilters({ activeFilters, handleDelete }: props) {

  return <div className="flex flex-row items-center justify-between px-[.5rem] py-[1rem] rounded-[1.25rem bg-white-bg h-[3rem] w-full mb-[1.5rem] rounded-[1.25rem] bg-white-bg dark:bg-dark-bg">
    <span className="text-text text-[.87rem] w-40 md:w-fit">Active Filters <span className="md:hidden inline">{`(${activeFilters.length})`}</span></span>
    <div className="flex flex-row items-center gap-[.5rem] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {activeFilters.map((filter, index) => {
        return <Chip
          className="bg-[#F7F7F7]"
          key={index}
          label={filter}
          // onClick={handleClick}
          onDelete={() => handleDelete(filter)}
          deleteIcon={<HugeiconsIcon icon={Cancel01Icon} className="text-black" size={16} />}
        />
      })}
    </div>
  </div>;
}

