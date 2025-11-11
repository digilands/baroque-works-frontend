import { Button } from "@mui/material";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import React from "react";
interface FilterButtonProps {
  numberOfFilters: number
}
export default function FilterButton({numberOfFilters}: FilterButtonProps) {
  return (<Button variant="outlined" startIcon={<FilterAltOutlinedIcon className="text- dark"/>} sx={{textTransform: 'none'}} className='w-[6.2rem] h-[2.1rem] border-[0.5px] border-gray-text1  text-gray-text1 rounded-[1.2rem] px-[3.3rem] ' >
   Filter <span className="text- dark pl-[1rem]">{numberOfFilters > 0 ? `${numberOfFilters}` : ''}</span>
</Button>)
}

export function FilterIcon(){
  return (
    <button className="rounded-[.5rem] p-[.5rem] w-[2.1rem] h-[2.1rem] bg- dark flex items-center justify-center">
<FilterAltOutlinedIcon className="text-white"/>
    </button>
  )
}
