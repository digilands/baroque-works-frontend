"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon, Notification02Icon } from "@hugeicons/core-free-icons";
import ProfileMenu from "@/components/ui/ProfileMenu";
import { useAuth } from "@/context/AuthContext";
import { updateHandymanProfile } from "@/lib/api";
import { internalApi } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

const THROTTLE_MS = 1500;

interface HeaderProps {
  onMenuClick: () => void;
  onNotificationClick: () => void;
  /** Current section title, e.g. "Jobs". */
  title: string;
  /** Ancestor trail for detail pages, e.g. ["Dashboard", "Jobs"]. */
  breadcrumbs?: { label: string; href: string }[];
  /** True when this is a detail/edit view — show crumb trail instead of bare title. */
  isDetail?: boolean;
}

async function fetchAvailability(): Promise<"available" | "unavailable"> {
  try {
    const { data } = await internalApi.get<{ handyman?: { availability?: { status?: string } } }>(
      "/handymen/me/profile",
    );
    return data?.handyman?.availability?.status === "unavailable"
      ? "unavailable"
      : "available";
  } catch {
    return "available";
  }
}

const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onNotificationClick,
  title,
  breadcrumbs = [],
  isDetail = false,
}) => {
  const { user } = useAuth();
  const isHandyman = user?.role === "handyman";
  const { data: seededStatus } = useQuery({
    queryKey: ["handyman", "availability"],
    queryFn: fetchAvailability,
    enabled: isHandyman,
    staleTime: 60_000,
  });

  const [available, setAvailable] = useState(true);
  const seededRef = useRef(false);
  const inFlight = useRef(false);
  const cooling = useRef(false);
  const desired = useRef<boolean | null>(null);
  const cooldownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const doSendRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    if (seededRef.current || !seededStatus) return;
    seededRef.current = true;
    if (desired.current === null) {
      setAvailable(seededStatus === "available");
    }
  }, [seededStatus]);

  useEffect(() => {
    const send = async () => {
      if (inFlight.current) return;
      const next = desired.current;
      if (next === null) return;
      desired.current = null;
      inFlight.current = true;
      try {
        await updateHandymanProfile({
          availability: { status: next ? "available" : "unavailable" },
        });
      } catch {
        setAvailable(!next);
      } finally {
        inFlight.current = false;
        cooling.current = true;
        if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
        cooldownTimer.current = setTimeout(() => {
          cooling.current = false;
          cooldownTimer.current = null;
          if (desired.current !== null) {
            void doSendRef.current();
          }
        }, THROTTLE_MS);
      }
    };
    doSendRef.current = send;
    return () => {
      if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    };
  }, []);

  const toggleAvailability = () => {
    if (!isHandyman) return;
    const next = !available;
    setAvailable(next);
    desired.current = next;
    if (!inFlight.current && !cooling.current) {
      void doSendRef.current();
    }
  };

  return (
    <header className="px-4 sm:px-6 pt-4 pb-2 bg-transparent mb-2 sm:mb-4 min-w-0 shrink-0">
      <div className="flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg shrink-0"
          >
            <HugeiconsIcon icon={Menu01Icon} size={22} />
          </button>

          <LinkBrand />

          {/* Desktop: breadcrumbs on detail pages, section title otherwise */}
          <nav
            aria-label="Breadcrumb"
            className="hidden lg:flex items-center gap-2 min-w-0 truncate text-lg font-medium text-gray-500"
          >
            {isDetail && breadcrumbs.length > 0 ? (
              <>
                {breadcrumbs.map((crumb) => (
                  <React.Fragment key={crumb.href}>
                    <a
                      href={crumb.href}
                      className="hover:text-gray-800 transition-colors truncate"
                    >
                      {crumb.label}
                    </a>
                    <span className="text-gray-300 shrink-0" aria-hidden>
                      /
                    </span>
                  </React.Fragment>
                ))}
                <span className="text-gray-800 truncate" aria-current="page">
                  {title}
                </span>
              </>
            ) : (
              <h1 className="truncate">{title}</h1>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isHandyman && (
            <button
              type="button"
              role="switch"
              aria-checked={available}
              aria-label="Availability"
              onClick={toggleAvailability}
              className="hidden lg:flex items-center gap-2 bg-white rounded-full px-1 py-1 border border-gray-200"
            >
              <span className="text-xs font-medium px-2 text-gray-600">
                {available ? "Available" : "Unavailable"}
              </span>
              <span
                className={`w-8 h-5 rounded-full relative transition-colors ${
                  available ? "bg-black" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    available ? "right-0.5" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          )}

          <button
            onClick={onNotificationClick}
            aria-label="Notifications"
            className="relative p-2 text-gray-500 hover:text-text transition-colors"
          >
            <HugeiconsIcon icon={Notification02Icon} size={22} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>

          <span className="lg:hidden">
            <ProfileMenu />
          </span>
        </div>
      </div>

      {/* Mobile: breadcrumbs or title on second row */}
      <nav
        aria-label="Breadcrumb"
        className="lg:hidden flex items-center gap-2 mt-2 min-w-0 truncate text-base font-medium text-gray-500"
      >
        {isDetail && breadcrumbs.length > 0 ? (
          <>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb.href}>
                <a
                  href={crumb.href}
                  className="hover:text-gray-800 transition-colors truncate"
                >
                  {crumb.label}
                </a>
                <span className="text-gray-300 shrink-0" aria-hidden>
                  /
                </span>
              </React.Fragment>
            ))}
            <span className="text-gray-800 truncate" aria-current="page">
              {title}
            </span>
          </>
        ) : (
          <h1 className="truncate">{title}</h1>
        )}
      </nav>
    </header>
  );
};

function LinkBrand() {
  return (
    <span className="lg:hidden flex items-center gap-2 min-w-0">
      <Image src="/handyman-logo.svg" alt="" width={24} height={24} />
      <span className="text-base font-bold text-text truncate">Handyman</span>
    </span>
  );
}

export default Header;
