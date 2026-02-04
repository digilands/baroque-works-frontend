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
    <div className="flex h-screen bg-bg overflow-hidden font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onNotificationClick={() => setIsNotificationsOpen(true)}
          title="Dashboard" 
        />
        
        <NotificationsModal 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)} 
        />
        
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {children}
        </div>
      </main>
    </div>
  );
}
