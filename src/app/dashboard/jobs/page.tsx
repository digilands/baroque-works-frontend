"use client";
import React, { useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Briefcase01Icon, 
  Location01Icon, 
  Calendar01Icon, 
  Clock01Icon,
  ArrowRight01Icon,
  FilterIcon,
  SearchIcon
} from "@hugeicons/core-free-icons";

const mockJobs = [
  {
    id: "1",
    title: "Fix leaking pipe in kitchen",
    client: "Sarah Johnson",
    category: "Plumbing",
    date: "Oct 24, 2025",
    time: "10:00 AM",
    location: "Ikeja, Lagos",
    price: "₦17,700",
    status: "pending"
  },
  {
    id: "2",
    title: "Air Conditioner Maintenance",
    client: "Mustapha Amin",
    category: "HVAC",
    date: "Oct 25, 2025",
    time: "02:00 PM",
    location: "Wuse, Abuja",
    price: "₦25,000",
    status: "active"
  },
  {
    id: "3",
    title: "Full house deep cleaning",
    client: "Alex Thompson",
    category: "Cleaning",
    date: "Oct 26, 2025",
    time: "09:00 AM",
    location: "Lekki, Lagos",
    price: "₦45,000",
    status: "pending"
  }
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState("all");

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
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
            <HugeiconsIcon icon={FilterIcon} size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {["all", "pending", "active", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize transition-all border-b-2 ${
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
      <div className="grid grid-cols-1 gap-4">
        {mockJobs.map((job) => (
          <Link 
            key={job.id} 
            href={`/dashboard/jobs/${job.id}`}
            className="group block bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    job.status === 'pending' ? 'bg-amber-50 text-amber-600' : 
                    job.status === 'active' ? 'bg-blue-50 text-blue-600' : 
                    'bg-green-50 text-green-600'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{job.category}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-4">
                  {job.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-gray-400" />
                    {job.date}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <HugeiconsIcon icon={Clock01Icon} size={16} className="text-gray-400" />
                    {job.time}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <HugeiconsIcon icon={Location01Icon} size={16} className="text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-gray-900 font-bold">
                    {job.price}
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-50 md:pl-6 min-w-[120px]">
                <div className="text-right md:text-center">
                  <p className="text-xs text-gray-400 mb-1">Client</p>
                  <p className="font-bold text-gray-900 text-sm">{job.client}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
