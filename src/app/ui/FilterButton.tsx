import { Button } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterIcon } from '@hugeicons/core-free-icons';
import React from "react";
interface FilterButtonProps {
  numberOfFilters: number
}
export default function FilterButton({numberOfFilters}: FilterButtonProps) {
  return (<Button variant="outlined" startIcon={<HugeiconsIcon icon={FilterIcon} color='black' size={17}/>} sx={{textTransform: 'none'}} className='w-[6.2rem] h-[2.1rem] border-[0.5px] border-gray-text1  text-gray-text1 rounded-[1.2rem] px-[3.3rem] ' >
   Filter <span className="text- dark pl-[1rem]">{numberOfFilters > 0 ? `${numberOfFilters}` : ''}</span>
</Button>)
}
