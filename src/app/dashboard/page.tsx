"use client";
import React, { Suspense } from "react";
import StatsCard from "@/components/dashboard/StatsCard";
import InsightsChart from "@/components/dashboard/InsightsChart";
import ScheduleWidget from "@/components/dashboard/ScheduleWidget";
import UpcomingJob from "@/components/dashboard/UpcomingJob";
import ReviewsList from "@/components/dashboard/ReviewsList";
import MessagesList from "@/components/dashboard/MessagesList";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ChartSkeleton, StatsSkeleton, WidgetSkeleton } from "@/components/dashboard/Skeletons";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
       {/* Welcome Section (Handled in Header mostly, but we can add more here if needed) */}
       
       {/* Stats Row */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ErrorBoundary fallback={<div className="h-40 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading stats</div>}>
            <Suspense fallback={<StatsSkeleton />}>
                <StatsCard 
                    title="Earnings" 
                    value="$1,560.00" 
                    subtitle="Last month"
                    type="earnings"
                />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="h-40 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading stats</div>}>
            <Suspense fallback={<StatsSkeleton />}>
                <StatsCard 
                    title="Rating" 
                    value="4.8" 
                    subtitle="234 ratings"
                    type="rating"
                />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary fallback={<div className="h-40 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading stats</div>}>
            <Suspense fallback={<StatsSkeleton />}>
                <StatsCard 
                    title="Jobs completed" 
                    value="8" 
                    subtext="out of 12"
                    subtitle="16 jobs"
                    type="jobs"
                />
            </Suspense>
          </ErrorBoundary>
       </div>

       {/* Main Content Area */}
       <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
              {/* Insights Chart */}
              <ErrorBoundary fallback={<div className="h-[300px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading chart</div>}>
                 <Suspense fallback={<ChartSkeleton />}>
                    <InsightsChart />
                 </Suspense>
              </ErrorBoundary>

              {/* Reviews & Messages */}
              <div className="flex flex-col md:flex-row gap-6">
                 <ErrorBoundary fallback={<div className="h-[200px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading reviews</div>}>
                    <ReviewsList />
                 </ErrorBoundary>
                 <ErrorBoundary fallback={<div className="h-[200px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading messages</div>}>
                    <MessagesList />
                 </ErrorBoundary>
              </div>
          </div>

          {/* Right Column (Sidebar Widgets) */}
          <div className="w-full lg:w-auto flex flex-col gap-6">
               <ErrorBoundary fallback={<div className="h-[300px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading schedule</div>}>
                 <Suspense fallback={<WidgetSkeleton />}>
                    <ScheduleWidget />
                 </Suspense>
               </ErrorBoundary>

               <ErrorBoundary fallback={<div className="h-[300px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">Error loading job</div>}>
                 <Suspense fallback={<WidgetSkeleton />}>
                    <UpcomingJob />
                 </Suspense>
               </ErrorBoundary>
          </div>
       </div>
    </div>
  );
}
