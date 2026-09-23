"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import NotificationsModal from "@/components/dashboard/NotificationsModal";

const SECTION_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  jobs: "Jobs",
  bookings: "My bookings",
  services: "Services",
  earnings: "Earnings",
  calendar: "Calendar",
  messages: "Messages",
  settings: "Settings",
  support: "Support",
  profile: "Profile",
  search: "Search",
  disputes: "Disputes",
};

/** Leaf labels for detail/edit/new views under a section. */
const DETAIL_LABELS: Record<string, string> = {
  create: "New",
  new: "New",
  edit: "Edit",
  "[id]": "Details",
};

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

function resolveHeader(pathname: string): {
  title: string;
  breadcrumbs: { label: string; href: string }[];
  isDetail: boolean;
} {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "dashboard") {
    return { title: "Dashboard", breadcrumbs: [], isDetail: false };
  }
  const rest = segments.slice(1);

  if (rest.length === 0) {
    return { title: "Dashboard", breadcrumbs: [], isDetail: false };
  }

  const sectionKey = rest[0];
  const sectionTitle = SECTION_TITLES[sectionKey] ?? capitalize(sectionKey);
  const sectionHref = `/dashboard/${sectionKey}`;

  // List/section page: single level deep only (e.g. /dashboard/jobs)
  if (rest.length === 1) {
    return { title: sectionTitle, breadcrumbs: [], isDetail: false };
  }

  // Detail/edit/new: breadcrumb trail Dashboard / Section / Leaf
  const leafRaw = rest[rest.length - 1];
  const leafLabel =
    DETAIL_LABELS[leafRaw] ??
    (leafRaw.length === 24 ? "Details" : capitalize(leafRaw));

  return {
    title: leafLabel,
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: sectionTitle, href: sectionHref },
    ],
    isDetail: true,
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const { title, breadcrumbs, isDetail } = resolveHeader(pathname);

  return (
    <div className="dashboard-shell flex h-dvh min-h-0 bg-bg overflow-hidden font-sans">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        collapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((v) => !v)}
      />

      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          onNotificationClick={() => setIsNotificationsOpen(true)}
          title={title}
          breadcrumbs={breadcrumbs}
          isDetail={isDetail}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
        />

        <div className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}
