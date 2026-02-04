"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Shield02Icon, 
  LockKeyIcon, 
  Globe02Icon,
  CheckmarkBadge01Icon,
  UserGroupIcon, 
  ThumbsUpIcon
} from "@hugeicons/core-free-icons";

const TrustSection = () => {
  return (
    <section className="py-20 px-4 md:px-12 bg-white flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
      {/* Left Content */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-4xl md:text-5xl font-extrabold text-text mb-6 leading-tight">
          Trust & Security.<br />
          <span className="text-gray-400">Built for your peace of mind.</span>
        </h2>
        <p className="text-gray-text1 text-lg mb-12">
          We combine simple identity verification with human support to ensure every handshake on our platform is safe and reliable.
        </p>

        <div className="space-y-6">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full bg-[#FFF8E1] flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Shield02Icon} size={24} className="text-[#D4A556]" />
             </div>
             <div>
                <h4 className="font-bold text-lg text-text">Verified Pros</h4>
                <p className="text-gray-text1 text-sm">Every professional goes through a rigorous identity check, ensuring 100% authenticity.</p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full bg-[#E3F2FD] flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={LockKeyIcon} size={24} className="text-[#2196F3]" />
             </div>
             <div>
                <h4 className="font-bold text-lg text-text">Secure Payments</h4>
                <p className="text-gray-text1 text-sm">Your payments are protected and only released when you are happy with the completed work.</p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full bg-[#E8F5E9] flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={Globe02Icon} size={24} className="text-[#4CAF50]" />
             </div>
             <div>
                <h4 className="font-bold text-lg text-text">Localized Support</h4>
                <p className="text-gray-text1 text-sm">We speak your language. Support available in English, Hausa, Igbo, and Yoruba.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Right Content - Bento Grid */}
      <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
         {/* Card 1 */}
         <div className="bg-[#FFF8E1] p-6 rounded-3xl h-48 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div className="self-end p-2 bg-white/50 rounded-full">
                <HugeiconsIcon icon={Shield02Icon} size={24} className="text-[#D4A556]" />
            </div>
            <div>
               <h3 className="text-3xl font-extrabold text-text">100%</h3>
               <p className="text-sm font-medium text-gray-600">Insured Jobs</p>
            </div>
         </div>

         {/* Card 2 */}
         <div className="bg-[#E8F5E9] p-6 rounded-3xl h-48 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
             <div className="self-end p-2 bg-white/50 rounded-full">
                <HugeiconsIcon icon={CheckmarkBadge01Icon} size={24} className="text-[#4CAF50]" />
            </div>
            <div>
               <h3 className="text-3xl font-extrabold text-text">24/7</h3>
               <p className="text-sm font-medium text-gray-600">Human Support</p>
            </div>
         </div>

         {/* Card 3 */}
         <div className="bg-[#E3F2FD] p-6 rounded-3xl h-48 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
             <div className="self-end p-2 bg-white/50 rounded-full">
                <HugeiconsIcon icon={ThumbsUpIcon} size={24} className="text-[#2196F3]" />
            </div>
            <div>
               <h3 className="text-3xl font-extrabold text-text">4.8/5</h3>
               <p className="text-sm font-medium text-gray-600">Average Rating</p>
            </div>
         </div>

         {/* Card 4 */}
         <div className="bg-[#F7F7F7] p-6 rounded-3xl h-48 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
             <div className="self-end p-2 bg-white/50 rounded-full">
                <HugeiconsIcon icon={UserGroupIcon} size={24} className="text-gray-400" />
            </div>
            <div>
               <h3 className="text-3xl font-extrabold text-text">50k+</h3>
               <p className="text-sm font-medium text-gray-600">Active Pros</p>
            </div>
         </div>
      </div>
    </section>
  );
};

export default TrustSection;
