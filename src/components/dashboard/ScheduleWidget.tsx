"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const ScheduleWidget = () => {
    // Mock simple calendar view
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm w-full md:w-[350px]">
       <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Schedule</h3>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
             <span>Aug</span>
             <div className="flex gap-1 ml-1 border-l border-gray-200 pl-1">
                 <button className="hover:text-black p-0.5 rounded hover:bg-gray-100 transition-colors">&lt;</button>
                 <button className="hover:text-black p-0.5 rounded hover:bg-gray-100 transition-colors">&gt;</button>
             </div>
             <HugeiconsIcon icon={Calendar01Icon} size={14} className="ml-1 text-gray-400" />
        </div>
      </div>

      <div className="bg-white p-6 pt-6 flex-1">
        {/* Days Row */}
        <div className="flex justify-between text-xs font-medium text-gray-400 mb-4">
           <div className="w-8 text-center">S</div>
           <div className="w-8 text-center">M</div>
           <div className="w-8 text-center">T</div>
           <div className="w-8 text-center">W</div>
           <div className="w-8 text-center">T</div>
           <div className="w-8 text-center">F</div>
           <div className="w-8 text-center">S</div>
        </div>
  
        {/* Dates Row (Mock) */}
         <div className="flex justify-between text-sm font-medium mb-8">
           <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-300">&lt;</div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black text-white cursor-pointer shadow-md">14</div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">15</div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">16</div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">17</div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">18</div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">&gt;</div>
        </div>
  
        <div className="flex justify-between items-center pt-5 border-t border-dashed border-gray-200">
           <p className="text-sm text-gray-900 font-medium">You have <span className="font-bold">2 jobs</span> today</p>
           <button className="text-xs bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100 font-medium">Details</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleWidget;
