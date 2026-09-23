"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string; // badge, e.g. "Last month", "234 ratings"
  subtext?: string; // e.g. "8 out of 12"
  icon?: React.ReactNode;
  type?: "earnings" | "rating" | "jobs" | "spent" | "posts" | "contracts";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  subtext,
  type = "default",
}) => {
  return (
    <div className="flex flex-col h-32 md:h-40 rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
      <div className="bg-gray-50/80 px-4 sm:px-6 py-4 flex justify-between items-start gap-2">
        <h3 className="text-gray-600 font-semibold text-sm">{title}</h3>
        {subtitle && (
          <span className="text-xs bg-gray-200/50 text-gray-500 px-2.5 py-1 rounded-md font-medium shrink-0">
            {subtitle}
          </span>
        )}
      </div>

      <div className="bg-white px-4 sm:px-6 pb-6 pt-2 flex-1 flex flex-col justify-center">
        <div className="flex items-center gap-2">
          {type === "rating" && (
            <HugeiconsIcon
              icon={StarIcon}
              size={24}
              className="text-amber-400 fill-amber-400"
            />
          )}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            {value}
          </h2>
          {subtext && (
            <span className="text-gray-400 text-sm font-medium mt-2">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
