"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification02Icon, Menu01Icon } from "@hugeicons/core-free-icons";

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onNotificationClick, title }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-transparent mb-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <HugeiconsIcon icon={Menu01Icon} size={24} />
        </button>
        <h1 className="text-xl font-semibold text-gray-500">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white rounded-full px-1 py-1 border border-gray-200">
           <span className="text-xs font-medium px-2 text-gray-600">Available</span>
           <div className="w-8 h-5 bg-black rounded-full relative cursor-pointer">
              <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full transition-transform"></div>
           </div>
        </div>

        <button 
          onClick={onNotificationClick}
          className="relative p-2 text-gray-500 hover:text-text transition-colors"
        >
           <HugeiconsIcon icon={Notification02Icon} size={24} />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
