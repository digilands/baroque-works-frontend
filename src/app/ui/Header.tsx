"use client";

import { nigerianStates } from "@/utils/data";
import React, { useState } from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  MessageMultiple01Icon,
  Notification02Icon,
  Search01Icon,
  Location04Icon,
  ArrowDown01Icon,
  Wrench01Icon
} from '@hugeicons/core-free-icons';
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState("Abuja");
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-8">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white group-hover:bg-black transition-all">
              <HugeiconsIcon icon={Wrench01Icon} size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">HomeHero</span>
          </Link>

          {/* Search & Location Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl items-center gap-2 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-1.5 focus-within:ring-4 focus-within:ring-indigo-100/50 focus-within:border-indigo-600 transition-all">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <HugeiconsIcon icon={Search01Icon} size={20} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="What service do you need today?"
                className="w-full bg-transparent border-none text-sm font-medium focus:outline-none placeholder:text-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            
            <div className="relative">
              <button 
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-xl transition-all"
              >
                <HugeiconsIcon icon={Location04Icon} size={18} className="text-indigo-600" />
                <span className="text-sm font-bold text-gray-700">{state}</span>
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} className="text-gray-400" />
              </button>

              {isLocationOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                  {nigerianStates.map((s) => (
                    <button
                      key={s}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signup" 
              className="hidden lg:block text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mr-2"
            >
              Become a Handyman
            </Link>

            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all relative">
                <HugeiconsIcon icon={MessageMultiple01Icon} size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
              </button>
              
              <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all relative">
                <HugeiconsIcon icon={Notification02Icon} size={22} />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>

            <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
               <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                 <Image width={40} height={40} src="/profile.png" alt="Profile" className="w-full h-full object-cover" />
               </div>
               <div className="hidden xl:block text-left">
                  <p className="text-sm font-bold text-gray-900 leading-none mb-1">Emeka J.</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lagos, NG</p>
               </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on mobile) */}
        <div className="mt-4 md:hidden">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search services..."
              className="w-full bg-transparent border-none text-sm font-medium focus:outline-none placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
