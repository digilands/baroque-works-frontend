"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  Cancel01Icon,
  Coins01Icon,
  CustomerSupportIcon,
  DashboardSquare01Icon,
  Briefcase01Icon,
  Message01Icon,
  PlusSignIcon,
  Search01Icon,
  Settings01Icon,
  SidebarLeft01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  badges?: { jobs?: number; messages?: number };
}

interface NavItem {
  name: string;
  href: string;
  icon: typeof DashboardSquare01Icon;
  badge?: number;
  end?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  collapsed = false,
  onToggleCollapse,
  badges = { jobs: 3, messages: 7 },
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isClient = user?.role === "client";

  const navItems: NavItem[] = isClient
    ? [
        { name: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon, end: true },
        { name: "Search", href: "/search", icon: Search01Icon },
        { name: "My jobs", href: "/dashboard/jobs", icon: Briefcase01Icon, badge: badges.jobs },
        { name: "My bookings", href: "/dashboard/bookings", icon: Calendar01Icon },
        { name: "Post a job", href: "/dashboard/jobs/create", icon: PlusSignIcon },
        { name: "Earnings", href: "/dashboard/earnings", icon: Coins01Icon },
        { name: "Calendar", href: "/dashboard/calendar", icon: Calendar01Icon },
        { name: "Messages", href: "/dashboard/messages", icon: Message01Icon, badge: badges.messages },
      ]
    : [
        { name: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon, end: true },
        { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase01Icon, badge: badges.jobs },
        { name: "Manage Services", href: "/dashboard/services", icon: Wrench01Icon },
        { name: "Add service", href: "/dashboard/services/create", icon: PlusSignIcon },
        { name: "Earnings", href: "/dashboard/earnings", icon: Coins01Icon },
        { name: "Calendar", href: "/dashboard/calendar", icon: Calendar01Icon },
        { name: "Messages", href: "/dashboard/messages", icon: Message01Icon, badge: badges.messages },
      ];

  const bottomItems: NavItem[] = [
    { name: "Settings", href: "/dashboard/settings", icon: Settings01Icon },
    { name: "Support", href: "/dashboard/support", icon: CustomerSupportIcon },
  ];

  const isActive = (item: NavItem) =>
    item.end ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  const initials =
    user?.fullname
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";
  const avatar = user?.image?.[0]?.url;

  const showLabels = !collapsed;

  return (
    <>
      {/* Invisible click-catcher — closes the drawer without dimming the page */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 h-dvh w-64 bg-gray-50 border-r border-gray-200 z-50
          transition-[transform,width] duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-dvh
          ${collapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        <div className={`flex flex-col h-full ${collapsed ? "lg:p-3" : "p-4"}`}>
          {/* Logo + collapse toggle */}
          <div
            className={`flex items-center justify-between mb-4 ${collapsed ? "lg:justify-center" : ""}`}
          >
            <Link
              href="/"
              className={`flex items-center gap-2.5 min-w-0 ${collapsed ? "lg:justify-center" : ""}`}
              aria-label="Handyman home"
            >
              <Image
                src="/handyman-logo.svg"
                alt=""
                width={28}
                height={28}
                className="shrink-0"
              />
              <span
                className={`text-lg font-bold text-text truncate ${collapsed ? "lg:hidden" : ""}`}
              >
                Handyman
              </span>
            </Link>
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="lg:hidden text-gray-500 p-1"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={22} />
            </button>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-pressed={collapsed}
                className="hidden lg:flex text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <HugeiconsIcon icon={SidebarLeft01Icon} size={18} />
              </button>
            )}
          </div>

          {/* Primary navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto min-h-0">
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={collapsed ? item.name : undefined}
                  className={`
                    flex items-center justify-between gap-2 px-3 py-2 rounded-xl transition-colors
                    ${collapsed ? "lg:justify-center lg:px-0" : ""}
                    ${
                      active
                        ? "bg-white text-text shadow-sm"
                        : "text-gray-500 hover:text-text hover:bg-gray-100/50"
                    }
                  `}
                >
                  <span className="relative flex items-center gap-3 min-w-0">
                    <span className="relative shrink-0">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={20}
                        className={active ? "text-text" : "text-gray-400"}
                      />
                      {item.badge != null && item.badge > 0 && !showLabels && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-gray-50" />
                      )}
                    </span>
                    <span
                      className={`truncate text-sm ${collapsed ? "lg:hidden" : ""}`}
                    >
                      {item.name}
                    </span>
                  </span>
                  {item.badge != null && item.badge > 0 && showLabels && (
                    <span className="shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom nav + user footer */}
          <div className="mt-auto pt-4 border-t border-gray-200 space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-xl transition-colors
                  ${collapsed ? "lg:justify-center lg:px-0" : ""}
                  ${
                    isActive(item)
                      ? "bg-white text-text shadow-sm"
                      : "text-gray-500 hover:text-text hover:bg-gray-100/50"
                  }
                `}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  className={`shrink-0 ${isActive(item) ? "text-text" : "text-gray-400"}`}
                />
                <span className={`truncate text-sm ${collapsed ? "lg:hidden" : ""}`}>
                  {item.name}
                </span>
              </Link>
            ))}

            {/* User footer — profile entry (logout lives on the profile page) */}
            <Link
              href="/dashboard/profile"
              title={collapsed ? user?.fullname : undefined}
              className={`flex items-center gap-3 px-2 py-2.5 mt-1 rounded-xl hover:bg-white/70 transition-colors ${
                collapsed ? "lg:justify-center lg:px-0" : ""
              }`}
            >
              <span className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                {avatar ? (
                  /* eslint-disable-next-line @next/next/no-img-element -- user avatar URL */
                  <img src={avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-gray-600">{initials}</span>
                )}
              </span>
              <span className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
                <span className="block text-sm font-semibold text-gray-900 truncate">
                  {user?.fullname ?? "Your profile"}
                </span>
                <span className="block text-xs text-gray-400 truncate">
                  {user?.email ?? ""}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
