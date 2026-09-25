"use client";

import { nigerianStates } from "@/utils/data";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from '@hugeicons/react';
import MessageMultiple01Icon from '@hugeicons/core-free-icons/MessageMultiple01Icon';
import Notification02Icon from '@hugeicons/core-free-icons/Notification02Icon';
import Search01Icon from '@hugeicons/core-free-icons/Search01Icon';
import Location04Icon from '@hugeicons/core-free-icons/Location04Icon';
import ArrowDown01Icon from '@hugeicons/core-free-icons/ArrowDown01Icon';
import Navigation03Icon from '@hugeicons/core-free-icons/Navigation03Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import Image from "next/image";
import Link from "next/link";
import { useGeolocation } from "@/hooks/useGeolocation";
import ProfileMenu from "@/components/ui/ProfileMenu";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [state, setState] = useState("Abuja");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const { position, status, requestLocation, clearLocation } = useGeolocation();
  const pendingNavigate = useRef(false);

  useEffect(() => {
    const value = searchTerm.trim();
    if (!value) return;
    const timer = window.setTimeout(() => {
      router.push(`/search?tab=services&query=${encodeURIComponent(value)}`);
    }, 400);
    return () => window.clearTimeout(timer);
  }, [router, searchTerm]);

  // After the user grants location, jump to the geo-filtered feed once.
  useEffect(() => {
    if (pendingNavigate.current && status === "granted" && position) {
      pendingNavigate.current = false;
      setIsLocationOpen(false);
      router.push(`/home?lat=${position.latitude}&lng=${position.longitude}`);
    }
    if (pendingNavigate.current && (status === "denied" || status === "error" || status === "unsupported")) {
      pendingNavigate.current = false;
    }
  }, [position, status, router]);

  const handleUseMyLocation = () => {
    pendingNavigate.current = true;
    requestLocation();
  };

  const handleClearGeo = () => {
    clearLocation();
    setIsLocationOpen(false);
    router.push("/home");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F7F0] pt-4 pb-2">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-3 md:gap-6">

          {/* Logo & Search Area */}
          <div className="flex items-center gap-6 md:gap-12 flex-1 min-w-0">
            <Link href="/" className="shrink-0">
              <span className="flex items-center gap-1.5 md:gap-2 text-xl md:text-2xl font-bold text-gray-900 tracking-tight whitespace-nowrap">
                <Image src="/handyman-logo.svg" alt="Handyman" width={32} height={32} className="w-7 h-7 md:w-8 md:h-8" />
                Handyman
              </span>
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
                <span className="text-gray-700">{position ? "Near you" : state}</span>
                <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="text-gray-500" />
              </button>

              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 max-h-64 overflow-y-auto animate-in fade-in zoom-in-50 duration-200">
                  <button
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-2"
                    onClick={handleUseMyLocation}
                    disabled={status === "locating"}
                  >
                    <HugeiconsIcon icon={Navigation03Icon} size={16} />
                    {status === "locating" ? "Locating…" : "Use my location"}
                  </button>
                  {position && (
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                      onClick={handleClearGeo}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} size={16} />
                      Clear location
                    </button>
                  )}
                  {(status === "denied" || status === "error") && (
                    <p className="px-4 py-2 text-xs text-red-500 font-medium">
                      Location unavailable. Check browser permissions.
                    </p>
                  )}
                  <div className="h-px bg-gray-100 my-1" />
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
          <div className="flex items-center gap-4 md:gap-8 shrink-0">
            <Link
              href="/auth/signup"
              className="hidden lg:block text-[15px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
            >
              Become a Handyman
            </Link>

            <div className="flex items-center gap-3 md:gap-5">
              <button className="shrink-0 text-gray-900 hover:text-gray-600 transition-colors">
                <HugeiconsIcon icon={MessageMultiple01Icon} size={22} />
              </button>

              <button className="shrink-0 text-gray-900 hover:text-gray-600 transition-colors">
                <HugeiconsIcon icon={Notification02Icon} size={22} />
              </button>

              <ProfileMenu />
            </div>
          </div>
        </div>

        {/* Mobile Search Bar (Only visible on mobile) */}
        <div className="mt-4 md:hidden flex items-center gap-2.5">
          <div className="flex items-center gap-3 bg-[#f0f0e9] rounded-full px-5 py-3 flex-1 min-w-0">
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-gray-900 shrink-0" />
            <input
              type="text"
              placeholder="What type of service do you want"
              className="w-full min-w-0 bg-transparent border-none text-[15px] font-medium text-gray-900 focus:outline-none placeholder:text-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            aria-label="Use my location"
            onClick={handleUseMyLocation}
            className="shrink-0 w-12 h-12 inline-flex items-center justify-center bg-[#f0f0e9] rounded-2xl text-gray-900 hover:bg-gray-200/60 transition-colors"
          >
            <HugeiconsIcon icon={Location04Icon} size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
