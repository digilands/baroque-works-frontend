"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  DashboardSquare01Icon, 
  Briefcase01Icon, 
  Settings01Icon, 
  Logout01Icon,
  Calendar01Icon,
  Message01Icon,
  Wallet01Icon,
  ServiceIcon,
  Wrench01Icon,
  Menu01Icon,
  Cancel01Icon
} from "@hugeicons/core-free-icons";

// Defining the props type
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
    { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase01Icon, badge: 3 },
    { name: "Manage Services", href: "/dashboard/services", icon: ServiceIcon },
    { name: "Earnings", href: "/dashboard/earnings", icon: Wallet01Icon },
    { name: "Calendar", href: "/dashboard/calendar", icon: Calendar01Icon },
    { name: "Messages", href: "/dashboard/messages", icon: Message01Icon, badge: 7 },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:h-screen
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-white">
                  <HugeiconsIcon icon={Wrench01Icon} size={18} strokeWidth={2} className="text-white" />
              </div>
              <span className="text-xl font-bold text-text">HomeHero</span>
            </Link>
            <button onClick={onClose} className="md:hidden text-gray-500">
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl transition-colors font-medium
                    ${isActive 
                      ? "bg-white text-text shadow-sm" 
                      : "text-gray-500 hover:text-text hover:bg-gray-100/50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <HugeiconsIcon 
                      icon={item.icon} 
                      size={20} 
                      className={isActive ? "text-text" : "text-gray-400"}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto space-y-1 pt-6 border-t border-gray-200">
             <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-text hover:bg-gray-100/50 transition-colors font-medium"
                >
               <HugeiconsIcon icon={Settings01Icon} size={20} className="text-gray-400" />
               <span>Settings</span>
             </Link>
             <button
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
               <HugeiconsIcon icon={Logout01Icon} size={20} className="text-gray-400 group-hover:text-red-600" />
               <span>Support</span>
             </button>

             {/* User Profile Mini */}
             <div className="mt-6 flex items-center gap-3 px-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                   {/* Placeholder avatar */}
                   <div className="w-full h-full bg-gray-300" /> 
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-sm font-bold text-text truncate">Emeka John</p>
                   <p className="text-xs text-gray-400 truncate">emekajohn@gmail.com</p>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
