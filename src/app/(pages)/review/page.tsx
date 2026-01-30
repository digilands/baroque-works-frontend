"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import Image01Icon from '@hugeicons/core-free-icons/Image01Icon';

export default function ReviewPage() {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [reviewText, setReviewText] = useState<string>("");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const tags = ["Punctual", "Affordable", "Skilled", "Friendly", "Clean Work"];

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        console.log({
            rating,
            selectedTags,
            reviewText,
            uploadedImage,
        });
        alert("Review submitted!");
    };

    return (
        <div className="min-h-screen bg-bg pb-8 flex justify-center">
            <div className="w-full max-w-2xl px-4">
                {/* Breadcrumb */}
                <div className="pt-6 pb-4">
                    <p className="text-gray-text1 text-xs">
                        Profile / Services / Completed services / Review
                    </p>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-text text-2xl font-bold mb-2">Rate Your Experience</h1>
                    <p className="text-gray-text1 text-sm">
                        Your feedback helps from improve and helps others choose with confidence
                    </p>
                </div>

                {/* Service Info */}
                <div className="mb-6">
                    <div className="mb-2">
                        <p className="text-gray-text3 text-xs font-medium mb-1">Handyman</p>
                        <p className="text-text text-sm font-semibold">Emeka Okoro</p>
                    </div>
                    <div>
                        <p className="text-gray-text3 text-xs font-medium mb-1">Service</p>
                        <p className="text-text text-sm font-semibold">General Maintenance - Bathroom cleaning</p>
                    </div>
                </div>

                {/* Overall Rating */}
                <div className="mb-6">
                    <p className="text-text text-sm font-semibold mb-3">Overall Rating</p>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110 focus:outline-none"
                            >
                                <svg
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    fill={star <= (hoveredRating || rating) ? "#FFD700" : "none"}
                                    stroke={star <= (hoveredRating || rating) ? "#FFD700" : "#D1D5DB"}
                                    strokeWidth="1.5"
                                    className="transition-colors"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </button>
                        ))}
                        <span className="text-text text-2xl font-bold ml-2">{rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* Feedback Tags */}
                <div className="mb-6">
                    <p className="text-text text-sm font-semibold mb-3">What made him/her stand out?</p>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag)
                                    ? "bg-dark text-white-bg dark:bg-white-bg dark:text-dark"
                                    : "bg-white-bg text-text border border-[#E9E9E9] dark:border-gray-700 hover:border-gray-text1"
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div className="mb-6">
                    <p className="text-text text-sm font-semibold mb-3">How was your experience?</p>
                    <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Write a few words about how the service went..."
                        className="w-full h-32 p-4 bg-white-bg text-text border border-[#E9E9E9] dark:border-gray-700 rounded-2xl resize-none focus:outline-none focus:border-gray-text1 transition-colors placeholder:text-gray-text1 text-sm"
                    />
                </div>

                {/* Photo Upload */}
                <div className="mb-8">
                    <p className="text-text text-sm font-semibold mb-1">Add a photo (optional)</p>
                    <p className="text-gray-text1 text-xs mb-3">
                        Share a picture of the work done. It helps other customers see the quality.
                    </p>
                    <label
                        htmlFor="photo-upload"
                        className="flex flex-col items-center justify-center w-full h-32 bg-white-bg border-2 border-dashed border-[#E9E9E9] dark:border-gray-700 rounded-2xl cursor-pointer hover:border-gray-text1 transition-colors"
                    >
                        {uploadedImage ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={uploadedImage}
                                    alt="Uploaded preview"
                                    fill
                                    className="object-cover rounded-2xl"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <HugeiconsIcon icon={Image01Icon} size={32} className="text-gray-text1 mb-2" />
                                <p className="text-gray-text1 text-sm font-medium">Upload Image</p>
                            </div>
                        )}
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full bg-dark text-white-bg dark:bg-white-bg dark:text-dark py-4 rounded-full font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
}
