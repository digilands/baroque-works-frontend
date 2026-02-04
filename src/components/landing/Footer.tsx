"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Wrench01Icon } from "@hugeicons/core-free-icons";

const Footer = () => {
  return (
    <footer className="py-12 bg-[#FDFCF8] border-t border-gray-100 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-4">
         <div className="w-8 h-8 rounded-full bg-[#D4A556] flex items-center justify-center text-white">
            <HugeiconsIcon icon={Wrench01Icon} size={18} strokeWidth={2} className="text-white" />
        </div>
        <span className="text-xl font-bold text-text">Handymen</span>
      </div>

      <p className="text-sm text-gray-text1 mb-8 max-w-md px-4">
        &copy; 2026 Handymen Localized Marketplace.<br /> 
        Built for the community, by the community.
      </p>

      <div className="flex gap-6 text-xs text-gray-400">
         <a href="#" className="hover:text-[#D4A556] transition-colors">Facebook</a>
         <a href="#" className="hover:text-[#D4A556] transition-colors">Twitter</a>
         <a href="#" className="hover:text-[#D4A556] transition-colors">Instagram</a>
      </div>
    </footer>
  );
};

export default Footer;
