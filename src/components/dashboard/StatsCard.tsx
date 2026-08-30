"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string; // e.g., "Last month", "234 ratings"
  subtext?: string; // e.g., "8 out of 12"
  icon?: any; // Optional icon
  type?: "earnings" | "rating" | "jobs";
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, subtext, icon, type = "default" }) => {
  return (
    <div className="flex flex-col h-32 md:h-40 rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-start">
        <h3 className="text-gray-600 font-semibold text-sm">{title}</h3>
        {subtitle && (
          <span className="text-xs bg-gray-200/50 text-gray-500 px-2.5 py-1 rounded-md font-medium">
            {subtitle}
          </span>
        )}
      </div>

      <div className="bg-white px-6 pb-6 pt-2 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {type === "rating" && (
            <HugeiconsIcon icon={StarIcon} size={24} className="text-amber-400 fill-amber-400" />
          )}
          <h2 className="text-3xl font-bold text-gray-900">{value}</h2>
          {subtext && <span className="text-gray-400 text-sm font-medium mt-2">{subtext}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
