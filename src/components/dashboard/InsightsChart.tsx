"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { name: "Jan", views: 10, requests: 5 },
  { name: "Feb", views: 40, requests: 25 },
  { name: "Mar", views: 30, requests: 15 },
  { name: "Apr", views: 45, requests: 10 },
  { name: "May", views: 0, requests: 0 },
  { name: "Jun", views: 0, requests: 0 },
  { name: "Jul", views: 0, requests: 0 },
  { name: "Aug", views: 0, requests: 0 },
  { name: "Sep", views: 0, requests: 0 },
  { name: "Oct", views: 0, requests: 0 },
  { name: "Nov", views: 0, requests: 0 },
  { name: "Dec", views: 0, requests: 0 },
];

const InsightsChart = () => {
  return (
    <div className="flex flex-col w-full h-[300px] rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Insights</h3>
      </div>

      {/* Body */}
      <div className="bg-white px-6 py-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <div>
              <div className="flex items-center gap-2 mb-1">
               <span className="text-gray-600 text-sm">Your services was viewed by</span>
               <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium">Today</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">45 <span className="text-sm font-normal text-gray-400">people</span></p>
           </div>
           
           {/* Custom Legend */}
           <div className="flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#FFE082] rounded-sm"></span> Views
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#4CAF50] rounded-sm"></span> Request
              </div>
           </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barSize={8}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="views" fill="#FFE082" radius={[4, 4, 4, 4]} />
              <Bar dataKey="requests" fill="#4CAF50" radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InsightsChart;
