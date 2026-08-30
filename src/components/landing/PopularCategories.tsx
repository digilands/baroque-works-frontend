"use client";
import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  SolarPanel01Icon, 
  ElectricHome01Icon, 
  PaintBoardIcon, 
  Wrench01Icon 
} from "@hugeicons/core-free-icons";

const categories = [
  {
    title: "Solar Installation",
    count: "34 Pros nearby",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80",
    icon: SolarPanel01Icon,
  },
  {
    title: "Smart Home Setup",
    count: "12 Pros nearby",
    image: "https://images.unsplash.com/photo-1558002038-1091a166111c?auto=format&fit=crop&w=600&q=80",
    icon: ElectricHome01Icon,
  },
  {
    title: "Masonry",
    count: "56 Pros nearby",
    image: "https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=600&q=80",
    icon: PaintBoardIcon, // Using paint icon as placeholder for masonry if unavailable, or just generically
  },
  {
    title: "Plumbing",
    count: "89 Pros nearby",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80",
    icon: Wrench01Icon,
  },
];

const PopularCategories = () => {
  return (
    <section className="py-16 px-4 md:px-12 bg-[#FDFCF8]">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-text">Popular Categories</h2>
        <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                &larr;
            </button>
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
                &rarr;
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="group cursor-pointer">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute bottom-3 left-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                 <HugeiconsIcon icon={cat.icon} size={20} className="text-[#D4A556]" />
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-text group-hover:text-[#D4A556] transition-colors">{cat.title}</h3>
            <p className="text-sm text-gray-text1">{cat.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;
