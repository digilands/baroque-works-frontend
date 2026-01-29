import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import { MessageMultiple01Icon } from '@hugeicons/core-free-icons';

interface HandymanProfileProps {
    image: string;
    name: string;
    rating: number;
    reviews: number;
}

export default function HandymanProfile({ image, name, rating, reviews }: HandymanProfileProps) {
    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 bg-white rounded-[1.25rem] border border-[#E9E9E9]">
            <div className="flex items-center gap-4">
                <Image
                    src={image}
                    alt={name}
                    width={60}
                    height={60}
                    className="rounded-full"
                />
                <div>
                    <h2 className="text-lg font-bold text-text">{name}</h2>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-bold text-text">{rating}</span>
                        <span className="text-gray-text1 text-sm">• {reviews} Reviews</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => alert('Messaging feature coming soon!')}
                className="mt-4 md:mt-0 px-6 py-2 bg-[#F2F2F2] rounded-[1rem] flex items-center gap-2 text-text font-medium text-sm w-full md:w-auto justify-center hover:bg-gray-200 transition-colors"
            >
                <HugeiconsIcon icon={MessageMultiple01Icon} size={18} />
                Message {name.split(' ')[0]}
            </button>
        </div>
    );
}
