"use client";
import React from "react";

export interface MessageItem {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
}

/** TODO(api): replace with a real messages endpoint when the backend ships one. */
const MOCK_MESSAGES: MessageItem[] = [
  {
    id: 1,
    sender: "Yusuf Samuel",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
    content: "Yeah, its complete. Thank you.",
    time: "5 minutes ago",
  },
  {
    id: 2,
    sender: "Sadiq Muhammad",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    content: "Yeah, its complete. Thank you.",
    time: "7 hours ago",
  },
];

interface MessagesListProps {
  messages?: MessageItem[];
}

const MessagesList = ({ messages = MOCK_MESSAGES }: MessagesListProps) => {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm w-full bg-white">
      <div className="bg-gray-50/80 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Messages</h3>
        <button className="text-xs bg-gray-200/50 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md font-medium transition-colors">
          see all
        </button>
      </div>

      <div className="bg-white p-4 sm:p-6 flex-1 space-y-5">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No messages yet.
          </p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-transparent group-hover:ring-gray-100 transition-all bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element -- chat avatars are external URLs */}
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {msg.sender}
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {msg.time}
                  </p>
                </div>
                <div className="bg-gray-50 group-hover:bg-gray-100 p-3 rounded-xl rounded-tl-none transition-colors">
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {msg.content}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesList;
