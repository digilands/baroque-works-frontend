import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import UserIcon from '@hugeicons/core-free-icons/UserIcon';
import ToolsIcon from '@hugeicons/core-free-icons/ToolsIcon';
import Image01Icon from '@hugeicons/core-free-icons/Image01Icon';

interface AboutHandymanProps {
    aboutMe: string;
    experience: string;
    previousWork: string[];
    category: string;
}

export default function AboutHandyman({ aboutMe, experience, previousWork, category }: AboutHandymanProps) {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div>
                <h3 className="text-text font-medium mb-3">About Handyman</h3>
                <div className="space-y-4">
                    {/* Profession/Category */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1"><HugeiconsIcon icon={ToolsIcon} size={20} className="text-gray-text1" /></div>
                        <div>
                            <h4 className="font-semibold text-text text-sm capitalize">{category || "Handyman"}</h4>
                            <p className="text-gray-text1 text-xs">{experience}</p>
                        </div>
                    </div>

                    {/* About Description */}
                    <div className="flex items-start gap-3">
                        <div className="mt-1"><HugeiconsIcon icon={UserIcon} size={20} className="text-gray-text1" /></div>
                        <div>
                            <h4 className="font-semibold text-text text-sm">About Me</h4>
                            <p className="text-gray-text1 text-xs leading-5 mt-1">{aboutMe}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Previous Work Gallery */}
            {previousWork.length > 0 && (
                <div>
                    <h3 className="text-text font-medium mb-3">Previous Work</h3>

                    {/* Placeholder for "Some gallery will contain before and after images" alert used in design */}
                    <div className="bg-[#FCFCE4] text-[#858509] px-4 py-2 rounded-lg text-xs flex items-center gap-2 mb-3 border border-[#E9E9C3]">
                        <HugeiconsIcon icon={Image01Icon} size={16} />
                        <span>Some gallery will contain before and after images</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {/* Display first 3 images or fewer */}
                        {previousWork.slice(0, 3).map((img, index) => (
                            <div key={index} className={`relative h-[8rem] rounded-xl overflow-hidden ${index === 0 ? "col-span-1" : "col-span-1"}`}>
                                <Image src={img} alt={`Work ${index + 1}`} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
