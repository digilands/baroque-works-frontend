"use client";

import { nigerianStates } from "@/utils/data";
import React, { useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import MessageMultiple01Icon from '@hugeicons/core-free-icons/MessageMultiple01Icon';
import Notification02Icon from '@hugeicons/core-free-icons/Notification02Icon';
import Search01Icon from '@hugeicons/core-free-icons/Search01Icon';
import Location04Icon from '@hugeicons/core-free-icons/Location04Icon';
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState("Abuja");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#F7F7F0] pt-4 pb-2">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="flex items-center justify-between gap-6">
          
          {/* Logo & Search Area */}
          <div className="flex items-center gap-12 flex-1">
            <Link href="/" className="shrink-0">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">HomeHero</span>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-3 bg-[#f0f0e9] rounded-full px-5 py-3 flex-1 max-w-md transition-all hover:bg-gray-200/50">
              <HugeiconsIcon icon={Search01Icon} size={20} className="text-gray-900" />
              <input 
                type="text" 
                placeholder="What type of service do you want"
                className="w-full bg-transparent border-none text-[15px] font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Location Selector */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-2 bg-[#f0f0e9] rounded-full px-5 py-3 hover:bg-gray-200/50 transition-all font-medium text-[15px]"
              >
                <HugeiconsIcon icon={Location04Icon} size={20} className="text-gray-900" />
                <span className="text-gray-700">{state}</span>
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-gray-500" />
              </button>

              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-50 duration-200">
                  {nigerianStates.map((s) => (
                    <button
                      key={s}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      onClick={() => {
                        setState(s);
                        setIsLocationOpen(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-8">
            <Link 
              href="/auth/signup" 
              className="hidden lg:block text-[15px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              Become a Handyman
            </Link>

            <div className="flex items-center gap-5">
              <button className="text-gray-900 hover:text-gray-600 transition-colors">
                <HugeiconsIcon icon={MessageMultiple01Icon} size={24} />
              </button>
              
              <button className="text-gray-900 hover:text-gray-600 transition-colors">
                <HugeiconsIcon icon={Notification02Icon} size={24} />
              </button>

              <button className="relative w-10 h-10 rounded-full bg-gray-200 overflow-hidden hover:opacity-90 transition-opacity">
                 <Image src="/profile.png" alt="Profile" fill className="object-cover" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on mobile) */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center gap-3 bg-[#f0f0e9] rounded-full px-5 py-3">
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-gray-900" />
            <input 
              type="text" 
              placeholder="What type of service do you want"
              className="w-full bg-transparent border-none text-[15px] font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
