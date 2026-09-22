"use client";
import React, { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import NotificationsModal from "@/components/dashboard/NotificationsModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="flex h-dvh min-h-0 bg-bg overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 min-w-0 flex flex-col h-full overflow-hidden relative">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onNotificationClick={() => setIsNotificationsOpen(true)}
          title="Dashboard" 
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
