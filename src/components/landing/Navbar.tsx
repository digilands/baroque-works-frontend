"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between py-4 px-4 md:px-12 bg-transparent border-b border-gray-200 relative z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/handyman-logo.svg" alt="Handyman" width={32} height={32} />
        <span className="text-xl font-bold text-text dark:text-white">HandyMan</span>
      </Link>

      {/* Desktop Links */}
      {/* TODO: All links currently redirect to /waitlist for early users. Use proper routes later. */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text dark:text-gray-300">
        <Link href="/waitlist" className="hover:text-gold transition-colors">Find a Pro</Link>
        <Link href="/waitlist" className="hover:text-gold transition-colors">Services</Link>
        <Link href="/waitlist" className="hover:text-gold transition-colors">How it works</Link>
        <Link href="/waitlist" className="hover:text-gold transition-colors font-bold text-gold">Join Waitlist</Link>
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

        {user ? (
          <>
            {/* TODO: All links currently redirect to /waitlist for early users. Use proper routes later. */}
            <Link href="/waitlist" className="text-sm font-semibold text-text hover:text-gold transition-colors">
              Dashboard
            </Link>
            <button
              onClick={() => logout()}
              className="bg-gold text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* TODO: All links currently redirect to /waitlist for early users. Use proper routes later. */}
            <Link href="/waitlist" className="text-sm font-semibold text-text hover:text-gold transition-colors">
              Log In
            </Link>
            <Link
              href="/waitlist"
              className="bg-gold text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Actions */}
      <div className="flex items-center gap-4 md:hidden">
        <Link 
          href="/waitlist" 
          className="bg-gold text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
        >
          Join Waitlist
        </Link>
        <button
          className="text-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <HugeiconsIcon icon={Menu01Icon} size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-black shadow-lg p-6 flex flex-col gap-4 md:hidden border-t border-gray-100 dark:border-gray-800">
          {/* TODO: All links currently redirect to /waitlist for early users. Use proper routes later. */}
          <Link href="/waitlist" className="text-text font-medium" onClick={() => setIsMenuOpen(false)}>Services</Link>
          <Link href="/waitlist" className="text-text font-medium" onClick={() => setIsMenuOpen(false)}>Find a Pro</Link>
          <Link href="/waitlist" className="text-text font-medium">About</Link>
          <div className="border-t border-gray-100 my-2 pt-2">
            <Link href="/waitlist" className="block w-full text-center py-2 font-semibold" onClick={() => setIsMenuOpen(false)}>Log In</Link>
            <Link href="/waitlist" className="block w-full bg-gold text-white text-center py-2 rounded-lg mt-2 font-semibold" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
