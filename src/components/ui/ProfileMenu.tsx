"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Logout01Icon,
  Settings01Icon,
  HelpCircleIcon,
  CreditCardIcon,
  Briefcase01Icon,
  StarIcon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/context/AuthContext";
import { isUnoptimizedSrc, normalizeImageSrc } from "@/lib/images";

const PROFILE_FIELDS = ["fullname", "phone", "bio", "address", "image"] as const;

function getCompletion(user: Record<string, unknown> | null) {
  if (!user) return 0;
  const completed = PROFILE_FIELDS.filter((field) => {
    const value = user[field];
    return Array.isArray(value) ? value.length > 0 : Boolean(value && String(value).trim());
  }).length;
  return Math.round((completed / PROFILE_FIELDS.length) * 100);
}

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const completion = useMemo(() => getCompletion(user as Record<string, unknown> | null), [user]);
  const isHandyman = user?.role === "handyman";
  const initials = user?.fullname?.trim()?.charAt(0).toUpperCase() || "?";
  const image = user?.image?.[0]?.url;
  const avatarSrc = normalizeImageSrc(image);

  const items = isHandyman
    ? [
        { label: "Public portfolio", href: "/dashboard/profile", icon: Briefcase01Icon },
        { label: "Reviews", href: "/dashboard/profile#reviews", icon: StarIcon },
        { label: "Certifications", href: "/dashboard/profile#certifications", icon: Certificate01Icon },
        { label: "Settings", href: "/dashboard/profile", icon: Settings01Icon },
      ]
    : [
        { label: "Payment methods", href: "/dashboard/profile#payments", icon: CreditCardIcon },
        { label: "Account settings", href: "/dashboard/profile", icon: Settings01Icon },
        { label: "Help & support", href: "/dashboard/profile#support", icon: HelpCircleIcon },
      ];

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={completion < 100 ? `Profile completeness ${completion}%` : "Open profile menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`relative w-9 h-9 md:w-11 md:h-11 rounded-full hover:scale-105 transition-transform shrink-0 ${completion < 100 ? "p-[3px] bg-[conic-gradient(#D4A556_var(--progress),#E5E7EB_0)]" : "border border-gray-200"}`}
        style={completion < 100 ? ({ "--progress": `${completion}%` } as React.CSSProperties) : undefined}
      >
        <span className="relative flex items-center justify-center w-full h-full rounded-full bg-white overflow-hidden">
          {image ? (
            <Image src={avatarSrc} alt="Profile" fill className="object-cover" sizes="44px" unoptimized={isUnoptimizedSrc(avatarSrc)} />
          ) : (
            <span className="text-sm font-bold text-gray-700">{initials}</span>
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl p-2 z-50">
          <div className="px-3 py-3 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900 truncate">{user?.fullname || "Your profile"}</p>
            <p className="text-xs text-gray-400 mt-1">Profile {completion}% complete</p>
            <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-[#D4A556] rounded-full" style={{ width: `${completion}%` }} />
            </div>
          </div>
          {completion < 100 && (
            <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="block px-3 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl">
              Complete your profile
            </Link>
          )}
          {items.map((item) => (
            <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl">
              <HugeiconsIcon icon={item.icon} size={18} className="text-gray-400" />
              {item.label}
            </Link>
          ))}
          <button onClick={() => void logout()} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl">
            <HugeiconsIcon icon={Logout01Icon} size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
