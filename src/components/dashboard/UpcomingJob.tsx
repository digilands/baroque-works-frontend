"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  UserCircleIcon, 
  Briefcase01Icon, 
  Calendar01Icon, 
  Clock01Icon,
  Location01Icon
} from "@hugeicons/core-free-icons";

const UpcomingJob = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm w-full md:w-[350px]">
       <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Upcoming Job</h3>
         <button className="text-xs bg-gray-200/50 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md font-medium transition-colors">Details</button>
      </div>

      <div className="bg-white p-6 space-y-5">
         {/* Client */}
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={UserCircleIcon} size={20} className="text-gray-400" />
            </div>
            <div>
               <p className="text-xs text-gray-400 font-medium mb-0.5">Client</p>
               <p className="font-bold text-gray-900 text-sm">Mustapha Amin</p>
            </div>
         </div>

         <div className="h-px bg-gray-50"></div>

         {/* Job Type */}
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Briefcase01Icon} size={20} className="text-gray-400" />
            </div>
             <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">General Maintenance</p>
                <p className="font-bold text-gray-900 text-sm">Office cleaning</p>
             </div>
         </div>

         <div className="h-px bg-gray-50"></div>

         {/* Date */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
                 <HugeiconsIcon icon={Calendar01Icon} size={20} className="text-gray-400" />
            </div>
             <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Date</p>
                <p className="font-semibold text-gray-900 text-sm">Today</p>
             </div>
         </div>

         {/* Time */}
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Clock01Icon} size={20} className="text-gray-400" />
             </div>
             <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Schedule</p>
                <p className="font-semibold text-gray-900 text-sm">4 Hours in the morning</p>
             </div>
         </div>

         <div className="h-px bg-gray-50"></div>

          {/* Location */}
          <div>
             <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                     <HugeiconsIcon icon={Location01Icon} size={20} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">Location</p>
                 </div>
                 <button className="flex items-center gap-1.5 text-xs bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-md hover:bg-gray-100 border border-gray-100 font-medium transition-colors">
                    <HugeiconsIcon icon={Location01Icon} size={14} className="text-gray-400" />
                    Map
                 </button>
             </div>
             <p className="font-medium text-gray-900 text-sm pl-14">No .88, Figma street, Wuse Abuja</p>
         </div>
          
           <div className="h-px bg-gray-50"></div>
           
           {/* Description */}
           <div>
              <p className="text-xs text-gray-400 font-medium mb-1.5">Description</p>
              <p className="font-medium text-gray-900 text-sm">No description</p>
           </div>
      </div>
    </div>
  );
};

export default UpcomingJob;
