import React from "react";

export const StatsSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-32 md:h-40 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-5 bg-gray-200 rounded w-12"></div>
    </div>
    <div className="mt-auto">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full h-[300px] animate-pulse">
    <div className="flex justify-between mb-6">
       <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
       </div>
    </div>
    <div className="h-[200px] bg-gray-100 rounded w-full"></div>
  </div>
);

export const WidgetSkeleton = () => (
   <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm w-full md:w-[350px] h-[300px] animate-pulse">
      <div className="flex justify-between mb-4">
         <div className="h-5 bg-gray-200 rounded w-1/3"></div>
         <div className="h-5 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="space-y-4">
         {[1, 2, 3].map(i => (
             <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
         ))}
      </div>
   </div>
);
