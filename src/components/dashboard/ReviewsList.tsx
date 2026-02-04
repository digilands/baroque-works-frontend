"use client";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const ReviewsList = () => {
    // Mock review data
  const review = {
    rating: 4.3,
    totalReviews: 50,
    comment: "Best cleaning service I've used. My office looks spotless and smells fresh. Highly recommend",
    reviewer: {
        name: "Alex Thompson",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
        date: "2 days ago",
        rating: 4.0
    }
  };

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 overflow-hidden shadow-sm w-full md:w-1/2">
      <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-center">
        <h3 className="text-gray-900 font-semibold">Reviews</h3>
        <button className="text-xs bg-gray-200/50 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded-md font-medium transition-colors">
          see all
        </button>
      </div>

      <div className="bg-white p-6 flex-1">
        <div className="flex items-center gap-2 mb-5">
           <HugeiconsIcon icon={StarIcon} size={20} className="text-amber-400 fill-amber-400" />
           <span className="font-bold text-lg text-gray-900">{review.rating}</span>
           <span className="text-gray-500 text-sm font-medium">• {review.totalReviews} Reviews</span>
           
               <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                 <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="rotate-180" />
               </button>
               <button className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
               </button>
        </div>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed bg-gray-50/50 p-4 rounded-xl">
          "{review.comment}"
        </p>

        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
           <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white">
                   <img src={review.reviewer.image} alt={review.reviewer.name} className="w-full h-full object-cover" />
               </div>
               <div>
                   <p className="font-bold text-sm text-gray-900">{review.reviewer.name}</p>
                   <p className="text-xs text-gray-500">{review.reviewer.date}</p>
               </div>
           </div>
           <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100">
              <HugeiconsIcon icon={StarIcon} size={12} className="text-amber-400 fill-amber-400" />
              <span className="font-bold text-xs text-gray-700">{review.reviewer.rating}</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
