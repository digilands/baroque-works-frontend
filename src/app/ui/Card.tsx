"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

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
    <Link href={`/services/${id}`} className="group block w-full cursor-pointer">
      <div className="flex flex-col gap-3">
        {/* Main Image */}
        <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-col gap-3 px-1">
          {/* Title and Price */}
          <div>
            <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
              {title}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              <span className="text-gray-900 font-bold">{rate}</span>
              <span className="mx-1.5 opacity-40">•</span>
              {rateType}
            </p>
          </div>

          {/* Footer: Profile & Rating */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src={profile.profilePic}
                  alt={profile.name}
                  fill
                  className="rounded-full object-cover border border-gray-100"
                />
              </div>
              
              <span className="text-xs text-gray-400 font-medium truncate max-w-[80px]">
                {profile.name}
              </span>

              {profile.availability && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold leading-none">
                  Available
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <HugeiconsIcon 
                icon={StarIcon} 
                size={14} 
                className="text-yellow-400 fill-yellow-400" 
              />
              <span className="text-xs font-bold text-gray-700">{profile.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
