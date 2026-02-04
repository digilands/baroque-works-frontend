"use client";
import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Cancel01Icon, 
  Message01Icon, 
  Wallet01Icon, 
  Briefcase01Icon, 
  Notification02Icon,
  CircleArrowRight01Icon
} from "@hugeicons/core-free-icons";

interface NotificationItem {
  id: string;
  type: "job" | "message" | "earnings" | "reminder";
  title: string;
  content?: string;
  time: string;
  tag?: string;
  unread: boolean;
  actionLabel?: string;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Record<string, NotificationItem[]> = {
  "Quick reminder": [
    {
      id: "1",
      type: "job",
      title: "You have a scheduled job in 3 hours.",
      time: "2 hours ago",
      unread: false,
    },
    {
      id: "2",
      type: "job",
      title: "You currently have 2 unconfirmed job requests.",
      time: "2:30pm",
      unread: false,
    },
  ],
  "Today": [
    {
      id: "3",
      type: "message",
      title: "Aisha Emmanuel sent you a message",
      content: "Yeah, its complete. Thank you.",
      time: "5 minutes ago",
      unread: true,
    },
    {
      id: "4",
      type: "message",
      title: "Aminu Danladi sent you a message",
      content: "Hello, this is Aisha Emmanuel reaching out to inquire about your handyman...",
      time: "2:30pm",
      tag: "House wiring",
      unread: false,
    },
    {
      id: "5",
      type: "job",
      title: "Mustapha Amin made a Job request",
      time: "1 hour ago",
      tag: "House wiring",
      actionLabel: "View details",
      unread: true,
    },
    {
      id: "6",
      type: "earnings",
      title: "Your account has been credited with $79.75",
      time: "2 hours ago",
      unread: false,
    },
  ],
  "Yesterday": [
    {
      id: "7",
      type: "earnings",
      title: "Your account has been credited with $45.00",
      time: "Yesterday",
      unread: false,
    },
    {
      id: "8",
      type: "message",
      title: "Aminu Danladi sent you a message",
      content: "Hello, this is Aisha Emmanuel reaching out to inquire about your handyman...",
      time: "Yesterday",
      unread: false,
    },
  ],
};

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("All");

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "message": return Message01Icon;
      case "earnings": return Wallet01Icon;
      case "job": return Briefcase01Icon;
      default: return Notification02Icon;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Modal */}
      <div className="relative w-full max-w-[480px] h-full bg-[#f8f8f8] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Notification</h2>
            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">7</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-6">
          <div className="bg-white p-1 rounded-xl flex gap-1 border border-gray-100 shadow-sm">
            {["All", "Message", "Earnings", "Job"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab 
                    ? "bg-[#111] text-white" 
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8 custom-scrollbar">
          {Object.entries(mockNotifications).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-sm font-bold text-gray-900 mb-4">{section}</h3>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="flex gap-4">
                      {/* Icon Circle */}
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                        <HugeiconsIcon 
                          icon={getIcon(item.type)} 
                          size={18} 
                          className="text-gray-500" 
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className={`text-sm ${item.unread ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap mt-1">
                            {item.time}
                          </span>
                        </div>

                        {item.content && (
                          <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm mt-3">
                            <p className="text-xs text-gray-500 leading-relaxed italic line-clamp-2">
                              {item.content}
                            </p>
                          </div>
                        )}

                        {item.tag && (
                          <div className="mt-3 flex items-center gap-2">
                             <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                               <HugeiconsIcon icon={Briefcase01Icon} size={12} className="text-gray-400" />
                               <span className="text-[10px] font-bold text-gray-600">{item.tag}</span>
                             </div>
                          </div>
                        )}

                        {item.actionLabel && (
                          <button className="mt-3 w-full sm:w-auto bg-[#111] text-white text-xs font-bold py-2 px-6 rounded-lg hover:bg-black transition-all shadow-sm">
                            {item.actionLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default NotificationsModal;
