import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, Tick02Icon } from "@hugeicons/core-free-icons";

interface CardProps {
  id: number;
  image: string;
  title: string;
  rate: string;
  rateType: string;
  category: string;
  subcategory: string;
  profile: {
    profilePic: string;
    name: string;
    availability: boolean;
    rating: number;
  }
}

export default function Card({ id, image, title, rate, rateType, profile }: CardProps) {
  return (
    <Link href={`/services/${id}`} className="group block h-full">
      <div className="bg-white rounded-3xl border border-gray-100 p-2 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-gray-200/50 hover:border-indigo-100 flex flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
            <HugeiconsIcon icon={StarIcon} size={12} className="text-yellow-500 fill-yellow-500" />
            <span className="text-[10px] font-bold text-gray-900">{profile.rating}</span>
          </div>

          {/* Availability Badge */}
          {profile.availability && (
            <div className="absolute bottom-3 left-3 bg-green-500/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Available</span>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1">
          <div className="mb-4">
            <h5 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1">
              {title}
            </h5>
            <p className="text-xs font-medium text-gray-400">
              {rate} <span className="text-[10px] opacity-70">•</span> {rateType}
            </p>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Image
                  src={profile.profilePic}
                  alt={profile.name}
                  width={34}
                  height={34}
                  className="rounded-full border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
                  <HugeiconsIcon icon={Tick02Icon} size={6} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-900">{profile.name}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">Verified</p>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
               </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
