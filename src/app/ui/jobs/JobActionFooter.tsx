"use client";

import { Check, X } from "lucide-react";

interface JobActionFooterProps {
  onAccept: () => void;
  onDecline: () => void;
  price: string;
}

export function JobActionFooter({ onAccept, onDecline, price }: JobActionFooterProps) {
  return (
    <div className="sticky bottom-0 -mx-6 -mb-6 p-4 md:p-6 bg-white/90 backdrop-blur-md border-t border-gray-200 z-10 mt-8">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="hidden sm:block">
           <p className="text-sm text-gray-500">Total Earnings</p>
           <p className="text-xl font-bold text-gray-900">{price}</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={onDecline}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all text-sm"
          >
            <X className="w-4 h-4" />
            Decline
          </button>
          
          <button 
            onClick={onAccept}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all text-sm"
          >
            <Check className="w-4 h-4" />
            Accept Request
          </button>
        </div>
      </div>
    </div>
  );
}
