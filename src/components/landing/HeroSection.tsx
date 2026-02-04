"use client";
import React from "react";
import { motion } from "framer-motion";
import TechnicalCircuit from "./TechnicalCircuit";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  Search01Icon, 
  Location01Icon, 
  ArrowRight01Icon, 
  CheckmarkBadge01Icon, 
  Time01Icon, 
  Globe02Icon,
  StarIcon
} from "@hugeicons/core-free-icons";
import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col md:flex-row items-center justify-between px-4 md:px-12 py-12 md:py-20 overflow-hidden bg-bg">
      {/* Background Circuit Animation */}
      <TechnicalCircuit />

      {/* Left Content */}
      <div className="relative z-10 w-full md:w-1/2 flex flex-col gap-6 md:gap-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#FDF6E3] border border-[#E8D4A2] rounded-full px-3 py-1 mb-4">
             <div className="w-2 h-2 rounded-full bg-gold"></div>
             <span className="text-xs font-bold text-[#A67C00] uppercase tracking-wider">Trusted Community Marketplace</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-text">
            Expert Hands.<br />
            <span className="text-[#D4A556] opacity-80">Local Hearts.</span>
          </h1>
        </motion.div>

        <motion.p 
          className="text-lg text-gray-text1 max-w-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The friendly neighborhood marketplace for trusted trade professionals. Find vetted electricians, plumbers, and masons right where you live.
        </motion.p>

        {/* Search Bar */}
        <motion.div 
          className="bg-white p-2 rounded-full shadow-lg flex flex-col md:flex-row items-center gap-2 max-w-xl border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full">
            <HugeiconsIcon icon={Search01Icon} size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="What service do you need?" 
              className="w-full bg-transparent outline-none text-text placeholder-gray-400"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-gray-200"></div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full border-t md:border-t-0 border-gray-100">
             <HugeiconsIcon icon={Location01Icon} size={20} className="text-gray-400" />
             <input 
              type="text" 
              placeholder="Lagos" 
              className="w-full bg-transparent outline-none text-text placeholder-gray-400"
            />
          </div>
          <button className="bg-[#D4A556] text-white p-3 rounded-full hover:opacity-90 transition-opacity w-full md:w-auto flex justify-center">
            <HugeiconsIcon icon={ArrowRight01Icon} size={24} />
          </button>
        </motion.div>

        {/* Badges */}
        <motion.div 
          className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium text-gray-text3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={CheckmarkBadge01Icon} size={18} className="text-green-500" />
            <span>ID Verified</span>
          </div>
          <div className="flex items-center gap-2">
             <HugeiconsIcon icon={Time01Icon} size={18} className="text-blue-500" />
             <span>Same Day Booking</span>
          </div>
          <div className="flex items-center gap-2">
             <HugeiconsIcon icon={Globe02Icon} size={18} className="text-[#D4A556]" />
             <span>Local Languages</span>
          </div>
        </motion.div>
      </div>

      {/* Right Content - Profile Card */}
      <div className="relative z-10 w-full md:w-1/2 flex justify-center md:justify-end mt-12 md:mt-0">
         <motion.div 
           className="relative w-full max-w-md"
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.3 }}
         >
           {/* Glass Card Background */}
           <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl -rotate-2 scale-105"></div>
           
           <div className="relative bg-[#FDFCF8] rounded-2xl p-6 shadow-xl border border-[#F0EAD6]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-text">Meet a Local Pro</h3>
                </div>
                <span className="text-[10px] font-bold tracking-widest text-[#D4A556] bg-[#FFF8E1] px-2 py-1 rounded">AVAILABLE NOW</span>
              </div>

              <div className="flex gap-4">
                 {/* Image */}
                 <div className="relative w-32 h-32 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=400&q=80" 
                      alt="Handyman"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-white px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                       <HugeiconsIcon icon={StarIcon} size={10} className="text-[#D4A556] fill-[#D4A556]" />
                       <span className="text-[10px] font-bold">4.9</span>
                    </div>
                 </div>

                 {/* Details */}
                 <div className="flex flex-col gap-2">
                    <div>
                      <h4 className="font-bold text-lg text-text">Tunde Adebayo</h4>
                      <p className="text-xs text-gray-text3 font-medium">Master Electrician</p>
                    </div>

                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2 text-xs text-text">
                        <HugeiconsIcon icon={Globe02Icon} size={14} className="text-gray-400" />
                        <span>Yoruba & English</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text">
                        <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} className="text-gray-400" />
                        <span>Solar Specialist</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text font-semibold">
                         <span className="text-gray-400">₦</span>
                         <span>4,500<span className="text-gray-400 font-normal">/hr</span></span>
                      </div>
                    </div>
                 </div>
              </div>

              <button className="w-full mt-6 bg-[#D4A556] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-[#D4A556]/20">
                Book Tunde
              </button>

              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-gray-100">
                 <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white"></div>
                 </div>
                 <p className="text-[10px] text-gray-text3">
                    Joined by <span className="font-bold text-text">124+ customers</span> this month
                 </p>
              </div>

               {/* Shimmer Effect */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                 <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
           </div>
         </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
