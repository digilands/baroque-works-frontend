import { nigerianStates } from "@/utils/data";
import React, { useState } from "react";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import { MessageMultiple01Icon, Notification02Icon, Search01Icon, Location04Icon } from '@hugeicons/core-free-icons';
import Image from "next/image";
export default function Header() {
  const [searchTerm, setSearchTerm] = useState("")
  const [state, setState] = useState("Abuja")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }

   const handleSelectChange = (event: SelectChangeEvent) => {
    setState(event.target.value as string);
  };
  return <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-screen pt-[3.1rem]">
  {/* Row 1 — HomeHero + right section */}
  <div className="flex flex-row items-center justify-between w-full lg:w-auto">
    {/* Item 1: HomeHero */}
    <h1 className="text-text font-bold text-[1.5rem]">HomeHero</h1>

    {/* Item 3: Right side — only visible on mobile here, visible on right for desktop */}
    <div className="flex flex-row items-center lg:hidden">
      <a href="" className="hidden">
        <span className="text-gray-text1 hover:text-gray-text3 mr-[1.5rem] ">Become a Handyman</span>
      </a>
      <IconButton>
        <HugeiconsIcon
      icon={MessageMultiple01Icon}
      color="black"    />
      </IconButton>
      <IconButton className="mr-[1.6rem]">
       <HugeiconsIcon icon={Notification02Icon} color="black" />
     </IconButton>
      <Image width={10} height={10} src="/profile.png" alt="profile picture" className="w-[2rem] h-[2rem]" />
    </div>
  </div>

  {/* Item 2: Search + Select */}
  <div className="flex flex-row w-full lg:w-auto mt-4 lg:mt-0">
    <TextField
    className="rounded-[.5rem] lg:rounded-[1.25rem] w-[23rem] h-[2.5rem] bg-[#F2F2F2]"
      sx={{
       
        '& .MuiOutlinedInput-root': {
          height: '2.5rem',
          '& fieldset': { border: 'none', borderRadius: '1.25rem' },
          '&.Mui-focused fieldset': { borderColor: ' dark' },
          '&:hover fieldset': { borderColor: '#666666' },
        },
      }}
      placeholder="What type of service do you want"
      value={searchTerm}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
           <HugeiconsIcon icon={Search01Icon}  color="black"/>
          </InputAdornment>
        ),
      }}
    />

    {/* mobile icon + invisible select overlay; desktop shows normal Select */}
    <div className="relative ml-[1rem]">
      {/* visible icon on mobile only */}
      <button aria-label="Select location" className="lg:hidden p-0 w-[2.5rem] h-[2.5rem] flex items-center justify-center bg-[#F2F2F2] rounded-[.5rem] lg:rounded-[1.25rem]">
       <HugeiconsIcon icon={Location04Icon} color="black"/>
      </button>

      <Select
        id="demo-simple-select"
        value={state}
        onChange={handleSelectChange}
        displayEmpty
        // overlay the select over the icon on mobile (captures clicks), normal on desktop
        className="absolute inset-0 h-full opacity-0 lg:opacity-100 lg:static lg:w-[10rem] lg:h-[2.5rem] lg:bg-[#F2F2F2] rounded-[.5rem] lg:rounded-[1.25rem]"
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
            borderRadius: '1.25rem',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: ' dark',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666666',
          },
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            paddingLeft: 0,
            overflow: 'visible',
          },
          '& .MuiSelect-icon': {
            display: 'none',
            '@media (min-width: 1024px)': { display: 'block' },
          },
        }}
        renderValue={(value) => (
          <Box className="flex items-center gap-[.4rem] ml-[.8rem]">
            {/* small icon shown inside select for desktop; mobile icon is the visible button above */}
            <HugeiconsIcon icon={Location04Icon} color="black" />
            <span className="hidden lg:inline">{value}</span>
          </Box>
        )}
      >
        {nigerianStates.map((s) => (
          <MenuItem key={s} value={s}>
            {s}
          </MenuItem>
        ))}
      </Select>
    </div>
  </div>

  {/* Item 3: Right side (desktop view only) */}
  <div className="hidden lg:flex flex-row items-center">
    <a href="" className="hidden lg:block">
      <span className="text-gray-text1 hover:text-gray-text3 mr-[1.5rem]">Become a Handyman</span>
    </a>
    <IconButton>
       <HugeiconsIcon
      icon={MessageMultiple01Icon}
      color="black"
    />
    </IconButton>
    <IconButton className="mr-[1.6rem]">
    <HugeiconsIcon icon={Notification02Icon} color="black" />
    </IconButton>
    <Image width={10} height={10} src="/profile.png" alt="profile picture" className="w-[2rem] h-[2rem]" />
  </div>
</div>
}
