"use client";
import React from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserCircleIcon,
  Briefcase01Icon,
  Calendar01Icon,
  Clock01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

export interface UpcomingJobData {
  clientName?: string;
  category?: string;
  title?: string;
  dateLabel?: string;
  scheduleLabel?: string;
  location?: string;
  description?: string;
  jobId?: string;
}

interface UpcomingJobProps {
  job?: UpcomingJobData | null;
}

/** Placeholder when no upcoming booking exists (or detail fetch fails). */
const EMPTY: UpcomingJobData = {
  clientName: "—",
  category: "No upcoming job",
  title: "Nothing scheduled yet",
  dateLabel: "—",
  scheduleLabel: "—",
  location: "—",
  description: "No description",
};

const UpcomingJob = ({ job }: UpcomingJobProps) => {
  const data = job ?? EMPTY;
  const detailsHref = data.jobId ? `/dashboard/jobs/${data.jobId}` : "/dashboard/bookings";

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm w-full bg-white">
      <div className="bg-gray-50/80 px-4 sm:px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Upcoming Job</h3>
        <Link
          href={detailsHref}
          className="text-xs bg-gray-200/50 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md font-medium transition-colors"
        >
          Details
        </Link>
      </div>

      <div className="bg-white p-4 sm:p-6 space-y-4 sm:space-y-5">
        {/* Client */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            <HugeiconsIcon
              icon={UserCircleIcon}
              size={20}
              className="text-gray-400"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Client</p>
            <p className="font-bold text-gray-900 text-sm truncate">
              {data.clientName}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Job type */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              size={20}
              className="text-gray-400"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              {data.category}
            </p>
            <p className="font-bold text-gray-900 text-sm truncate">
              {data.title}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Date */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <HugeiconsIcon
              icon={Calendar01Icon}
              size={20}
              className="text-gray-400"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
            <p className="font-semibold text-gray-900 text-sm">
              {data.dateLabel}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <HugeiconsIcon
              icon={Clock01Icon}
              size={20}
              className="text-gray-400"
            />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              Schedule
            </p>
            <p className="font-semibold text-gray-900 text-sm">
              {data.scheduleLabel}
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Location */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={20}
                  className="text-gray-400"
                />
              </div>
              <p className="text-xs text-gray-400 font-medium">Location</p>
            </div>
            <Link
              href="/search?tab=map"
              className="flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md hover:bg-gray-100 border border-gray-100 font-medium transition-colors"
            >
              <HugeiconsIcon icon={Location01Icon} size={14} />
              Map
            </Link>
          </div>
          <p className="font-medium text-gray-900 text-sm sm:pl-14 break-words">
            {data.location}
          </p>
        </div>

        <div className="h-px bg-gray-50" />

        {/* Description */}
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">
            Description
          </p>
          <p className="font-medium text-gray-900 text-sm">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpcomingJob;
