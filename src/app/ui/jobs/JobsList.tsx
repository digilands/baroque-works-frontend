"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Briefcase01Icon,
  Calendar01Icon,
  Clock01Icon,
  ArrowRight01Icon,
  FilterIcon,
  SearchIcon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import type { JobListItem } from "@/lib/server/mappers";
import { mapJobToListItem } from "@/lib/server/mappers";
import type { ApiJob } from "@/lib/server/queries";
import { useSSE } from "@/hooks/useSSE";

interface JobsListProps {
  jobs: JobListItem[];
  categoryNames: Record<string, string>;
}

const TABS = ["all", "pending", "active", "completed"] as const;

// Backend status (lowercased) -> tab.
function tabFor(status: string): string {
  if (status === "open") return "pending";
  if (status === "in_progress") return "active";
  if (status === "completed") return "completed";
  return "other";
}

function statusStyles(status: string): string {
  if (status === "open") return "bg-amber-50 text-amber-600";
  if (status === "in_progress") return "bg-blue-50 text-blue-600";
  if (status === "completed") return "bg-green-50 text-green-600";
  return "bg-gray-100 text-gray-600";
}

export default function JobsList({ jobs, categoryNames }: JobsListProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [query, setQuery] = useState("");
  // Live job list via SSE; falls back to the server-rendered list.
  const [liveJobs, setLiveJobs] = useState(jobs);
  useSSE("jobs", (data) => {
    const list = (data as { jobs?: ApiJob[] })?.jobs;
    if (Array.isArray(list)) setLiveJobs(list.map((job) => mapJobToListItem(job, categoryNames[job.category])));
  });

  const visible = liveJobs.filter((job) => {
    if (activeTab !== "all" && tabFor(job.status) !== activeTab) return false;
    if (query && !job.title.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Requests</h1>
          <p className="text-gray-500 text-sm">Manage and track your service requests</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <HugeiconsIcon icon={SearchIcon} size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <HugeiconsIcon icon={FilterIcon} size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-100">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 px-4 sm:px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 ${
              activeTab === tab
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {visible.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <HugeiconsIcon icon={Briefcase01Icon} size={24} className="text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">No jobs found</h3>
          <p className="text-sm text-gray-400">
            New job requests in your area will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visible.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/jobs/${job.id}`}
              className="group block min-w-0 bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 hover:border-indigo-200 hover:shadow-md transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles(job.status)}`}>
                      {job.status.replace("_", " ")}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{job.category}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-4">
                    {job.title}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-gray-400" />
                      {job.date}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <HugeiconsIcon icon={Clock01Icon} size={16} className="text-gray-400" />
                      {job.urgency}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <HugeiconsIcon icon={Location01Icon} size={16} className="text-gray-400" />
                      {job.distance || "Nearby"}
                    </div>
                    <div className="flex items-center gap-2 text-gray-900 font-bold">
                      {job.budget}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-50 md:pl-6 min-w-[120px]">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
