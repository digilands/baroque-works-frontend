"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Wrench01Icon } from "@hugeicons/core-free-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between py-4 px-4 md:px-12 bg-transparent border-b border-gray-200 relative z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">
            <HugeiconsIcon icon={Wrench01Icon} size={18} strokeWidth={2} className="text-white" />
        </div>
        <span className="text-xl font-bold text-text dark:text-white">Handymen</span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text dark:text-gray-300">
        <Link href="#" className="hover:text-gold transition-colors">Services</Link>
        <Link href="#" className="hover:text-gold transition-colors">Pros</Link>
        <Link href="#" className="hover:text-gold transition-colors">About</Link>
      </div>

      {/* Right Side Actions */}
      <div className="hidden md:flex items-center gap-6">
        {/* Language Switcher */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-text3 bg-white/50 backdrop-blur-sm rounded-full px-3 py-1 border border-black/5">
             <span className="text-gold font-bold">EN</span>
             <span>HA</span>
             <span>IG</span>
             <span>YO</span>
        </div>

        <Link href="/login" className="text-sm font-semibold text-text hover:text-gold transition-colors">
          Log In
        </Link>
        <Link
          href="/signup"
          className="bg-gold text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          Sign Up
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-text"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <HugeiconsIcon icon={Menu01Icon} size={24} />
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-black shadow-lg p-6 flex flex-col gap-4 md:hidden border-t border-gray-100 dark:border-gray-800">
          <Link href="#" className="text-text font-medium">Services</Link>
          <Link href="#" className="text-text font-medium">Pros</Link>
          <Link href="#" className="text-text font-medium">About</Link>
          <div className="border-t border-gray-100 my-2 pt-2">
              <div className="flex gap-4 mb-4 text-xs font-medium text-gray-500">
                  <span className="text-gold">EN</span> <span>HA</span> <span>IG</span> <span>YO</span>
              </div>
            <Link href="/login" className="block w-full text-center py-2 font-semibold">Log In</Link>
            <Link href="/signup" className="block w-full bg-gold text-white text-center py-2 rounded-lg mt-2 font-semibold">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
