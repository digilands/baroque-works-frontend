import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import MessageMultiple01Icon from '@hugeicons/core-free-icons/MessageMultiple01Icon';

interface HandymanProfileProps {
    image: string;
    name: string;
    rating: number;
    reviews: number;
}

export default function HandymanProfile({ image, name, rating, reviews }: HandymanProfileProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-6 bg-white rounded-[1.25rem] border border-[#EDEDED] shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-5">
                <Image
                    src={image}
                    alt={name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover"
                />
                <div>
                    <h2 className="text-xl font-bold text-text mb-1">{name}</h2>
                    <div className="flex items-center gap-1.5">
                        <span className="text-yellow-500 text-sm">⭐</span>
                        <span className="font-bold text-text text-sm">{rating}</span>
                        <span className="text-gray-text1 text-sm">• {reviews} Reviews</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => alert('Messaging feature coming soon!')}
                className="mt-4 md:mt-0 px-6 py-2.5 bg-[#F7F7F7] rounded-2xl flex items-center gap-2 text-text font-semibold text-sm w-full md:w-auto justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all duration-200"
            >
                <HugeiconsIcon icon={MessageMultiple01Icon} size={18} />
                Message {name.split(' ')[0]}
            </button>
        </div>
    );
}
