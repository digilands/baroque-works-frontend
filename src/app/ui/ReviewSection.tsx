import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';

interface ReviewProps {
    rating: number;
    count: number;
    review: {
        reviewerName: string;
        reviewerPic: string;
        rating: number;
        date: string;
        comment: string;
    } | null;
}

export default function ReviewSection({ rating, count, review }: ReviewProps) {
    return (
        <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-yellow-500 text-base">⭐</span>
                    <span className="font-bold text-text text-base">{rating}</span>
                    <span className="text-gray-text1 text-sm font-medium">• {count} Reviews</span>
                </div>
                <button
                    onClick={() => alert('All reviews page coming soon!')}
                    className="flex items-center text-text text-sm font-semibold gap-1.5 hover:opacity-70 transition-opacity"
                >
                    See all reviews <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </button>
            </div>

            {review ? (
                <div className="bg-white rounded-[1.25rem] p-4 border border-[#E9E9E9]">
                    <p className="text-text text-xs mb-3 leading-5">{review.comment}</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image src={review.reviewerPic} alt={review.reviewerName} width={32} height={32} className="rounded-full" />
                            <div>
                                <h5 className="text-text text-xs font-semibold">{review.reviewerName}</h5>
                                <p className="text-gray-text1 text-[0.65rem]">{review.date}</p>
                            </div>
                        </div>
                        <span className="font-bold text-text text-sm">{review.rating.toFixed(1)}</span>
                    </div>
                </div>
            ) : (
                <div className="text-gray-text1 text-sm italic">No reviews yet.</div>
            )}
        </div>
    );
}
