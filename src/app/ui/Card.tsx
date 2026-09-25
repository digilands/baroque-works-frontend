"use client";

import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";
import { isUnoptimizedSrc, normalizeImageSrc } from "@/lib/images";

interface CardProps {
  id: string;
  image: string;
  title: string;
  rate: string;
  rateType: string;
  profile: {
    profilePic: string;
    name: string;
    availability: boolean;
    rating: number;
  }
}

const FALLBACK_IMAGE = "https://placehold.co/600x400?text=Handyman";
const FALLBACK_AVATAR = "https://placehold.co/100x100?text=BW";

export default memo(function Card({ id, image, title, rate, rateType, profile }: CardProps) {
  const router = useRouter();
  const imageSrc = normalizeImageSrc(image, FALLBACK_IMAGE);
  const avatarSrc = normalizeImageSrc(profile.profilePic, FALLBACK_AVATAR);
  return (
    <Link
      href={`/services/${id}`}
      onMouseEnter={() => router.prefetch(`/services/${id}`)}
      className="group block w-full cursor-pointer"
    >
      <div className="flex flex-col gap-2.5">
        {/* Main Image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] rounded-2xl overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={isUnoptimizedSrc(imageSrc)}
          />
        </div>

        <div className="flex flex-col gap-2.5 px-0.5">
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
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-6 h-6 shrink-0">
                <Image
                  src={avatarSrc}
                  alt={profile.name}
                  fill
                  sizes="24px"
                  className="rounded-full object-cover border border-gray-100"
                  unoptimized={isUnoptimizedSrc(avatarSrc)}
                />
              </div>

              <span className="text-xs text-gray-400 font-medium truncate max-w-[100px] sm:max-w-[80px]">
                {profile.name}
              </span>

              {profile.availability && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold leading-none shrink-0">
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
});
