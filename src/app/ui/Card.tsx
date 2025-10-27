import Image from "next/image";
import React from "react";

interface CardProps {
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

export default function Card({ image, title, rate, rateType, profile }: CardProps) {
  
  return (
    <div className="rounded-2xl w-full">
      <div className="relative w-full h-[11rem]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <h5 className="text-text text-[.8rem] font-regular mt-3">{title}</h5>
      <p className="text-[.7rem] text-text">{`${rate} • ${rateType}`}</p>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Image
            src={profile.profilePic}
            alt={profile.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div className="flex items-center gap-1">
            <span className="text-gray-text1 text-[.87rem]">{profile.name}</span>
            {profile.availability && (
              <div className="px-[.5rem] py-[.25rem] w-[3.6rem] h-[1.2rem] flex items-center bg-[#D3FBDE] rounded-[1.7rem]">
                <span className="text-[#1A6D1F] text-[0.65rem] font-medium">Available</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-text text-sm">{`⭐ ${profile.rating}`}</span>
      </div>
    </div>
  );
}
