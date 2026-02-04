"use client";

import React, { useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ImageAdd01Icon, 
  StarIcon, 
  Tick02Icon, 
  ArrowLeft01Icon,
  Navigation03Icon
} from '@hugeicons/core-free-icons';
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
    const router = useRouter();
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [reviewText, setReviewText] = useState<string>("");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const tags = ["Punctual", "Affordable", "Skilled", "Friendly", "Clean Work", "Polite", "Responsive"];

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
        // Success animation/feedback would go here
        alert("Review submitted successfully! Thank you for your feedback.");
        router.back();
    };

    return (
        <div className="min-h-screen bg-white pb-20 pt-10 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-12">
                   <button onClick={() => router.back()} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors group">
                      <HugeiconsIcon icon={ArrowLeft01Icon} size={18} className="group-hover:-translate-x-1 transition-transform" />
                      Back
                   </button>
                   <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <HugeiconsIcon icon={Navigation03Icon} size={14} />
                      Completed Service
                   </div>
                </div>

                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Rate Your Experience</h1>
                    <p className="text-gray-500 font-medium max-w-lg">
                        Your honest feedback helps our community of pros maintain high standards and helps others choose with confidence.
                    </p>
                </div>

                {/* Handyman Info Card */}
                <div className="bg-gray-50 rounded-[2.5rem] p-8 mb-12 flex flex-col md:flex-row items-center gap-8 border border-gray-100">
                    <div className="relative w-24 h-24">
                        <Image
                            src="/profile.png"
                            alt="Emeka Okoro"
                            fill
                            className="object-cover rounded-full border-4 border-white shadow-xl"
                        />
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-full border-4 border-white flex items-center justify-center">
                            <HugeiconsIcon icon={Tick02Icon} size={14} className="text-white" />
                        </div>
                    </div>
                    <div className="text-center md:text-left flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Service Provided By</p>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">Emeka Okoro</h3>
                        <p className="text-sm font-bold text-indigo-600">General Maintenance • Bathroom Cleaning</p>
                    </div>
                </div>

                <div className="space-y-16">
                    {/* Overall Rating */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-gray-900">Overall Satisfaction</h3>
                            {rating > 0 && (
                                <span className="px-4 py-1.5 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold animate-in zoom-in-50">
                                    {rating}.0 Stars
                                </span>
                            )}
                        </div>
                        <div className="flex items-center justify-center gap-4 py-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    className="group relative transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <HugeiconsIcon 
                                        icon={StarIcon} 
                                        size={48} 
                                        className={`transition-all duration-300 ${
                                            star <= (hoveredRating || rating) 
                                            ? "text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" 
                                            : "text-gray-200"
                                        }`} 
                                    />
                                    {star <= (hoveredRating || rating) && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping opacity-20" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Feedback Tags */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-8">What highlights your experience?</h3>
                        <div className="flex flex-wrap gap-3">
                            {tags.map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => toggleTag(tag)}
                                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2 ${
                                        selectedTags.includes(tag)
                                        ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200"
                                        : "bg-white border-gray-50 text-gray-500 hover:border-gray-200 hover:text-gray-900"
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Review Text */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-8">Tell us more about it</h3>
                        <div className="relative group">
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Describe your experience in a few words..."
                                className="w-full h-48 p-8 bg-gray-50 border border-gray-50 rounded-[2.5rem] text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100/50 focus:border-indigo-600 transition-all placeholder:text-gray-300 leading-relaxed resize-none"
                            />
                            <div className="absolute bottom-6 right-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                {reviewText.length} characters
                            </div>
                        </div>
                    </section>

                    {/* Photo Upload */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add visual proof (Optional)</h3>
                        <p className="text-sm font-medium text-gray-400 mb-8">
                            Share a photo of the completed work. It helps others verify quality.
                        </p>
                        
                        <label className="block">
                            <div className={`relative h-56 rounded-[2.5rem] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                                uploadedImage 
                                ? "border-indigo-600 bg-indigo-50" 
                                : "border-gray-100 bg-gray-50 hover:bg-white hover:border-indigo-200"
                            }`}>
                                {uploadedImage ? (
                                    <>
                                        <Image src={uploadedImage} alt="Preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <p className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full uppercase tracking-widest">Change Photo</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                            <HugeiconsIcon icon={ImageAdd01Icon} size={28} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">Upload Project Images</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">JPEG, PNG up to 10MB</p>
                                    </div>
                                )}
                            </div>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                    </section>

                    {/* Submit Button */}
                    <div className="pt-10">
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-bold text-lg hover:bg-black transition-all shadow-2xl shadow-gray-300 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed group"
                        >
                            <span className="flex items-center justify-center gap-3">
                                Submit Review
                                <HugeiconsIcon icon={Tick02Icon} size={20} className="group-hover:scale-125 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
