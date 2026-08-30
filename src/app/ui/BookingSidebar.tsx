"use client";

import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import InformationCircleIcon from '@hugeicons/core-free-icons/InformationCircleIcon';
import Tick02Icon from '@hugeicons/core-free-icons/Tick02Icon';
import Calendar03Icon from '@hugeicons/core-free-icons/Calendar03Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';

interface OfferedService {
    name: string;
    image: string;
    rate: string;
    rateType: string;
}

interface BookingSidebarProps {
    handymanName: string;
    services: OfferedService[];
    onBookService: () => void;
    selectedServiceIndex: number;
    onServiceSelect: (index: number) => void;
}

export default function BookingSidebar({ handymanName, services, onBookService, selectedServiceIndex, onServiceSelect }: BookingSidebarProps) {
    const selectedService = services[selectedServiceIndex] || services[0];
    const firstName = handymanName.split(' ')[0];

    return (
        <div className="w-full flex flex-col gap-10 bg-white">
            {/* Services List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Services by {firstName}</h3>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-widest">{services.length} Total</span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
                    {services.length > 0 ? services.map((s, idx) => {
                        const isSelected = selectedServiceIndex === idx;
                        return (
                            <button
                                key={idx}
                                onClick={() => onServiceSelect(idx)}
                                className={`group min-w-[10rem] text-left flex flex-col gap-3 transition-all duration-500 rounded-[1.5rem] p-2 border-2 ${
                                    isSelected 
                                    ? 'border-indigo-600 bg-indigo-50/30' 
                                    : 'border-transparent hover:border-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                <div className="relative w-full aspect-square rounded-[1.25rem] overflow-hidden shadow-sm">
                                    <Image src={s.image} alt={s.name} fill className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border-2 border-white animate-in zoom-in">
                                            <HugeiconsIcon icon={Tick02Icon} size={12} />
                                        </div>
                                    )}
                                </div>
                                <div className="px-1">
                                    <h4 className={`text-xs font-extrabold truncate mb-0.5 ${isSelected ? 'text-indigo-600' : 'text-gray-900'}`}>{s.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 capitalize">{s.rate} • {s.rateType}</p>
                                </div>
                            </button>
                        );
                    }) : <p className="text-gray-400 text-sm italic py-4">No specific services listed.</p>}
                </div>
            </div>

            {/* Price & Features */}
            <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div className="bg-white p-2.5 rounded-xl shadow-sm">
                             <HugeiconsIcon icon={Clock01Icon} size={20} className="text-gray-400" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Rate</p>
                            <div className="flex items-baseline justify-end gap-1">
                                <span className="text-3xl font-extrabold text-gray-900">$30.00</span>
                                <span className="text-xs font-bold text-gray-400">/hr</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                            <HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-indigo-600" />
                            <span>2 hours minimum booking</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                            <HugeiconsIcon icon={Calendar03Icon} size={16} className="text-indigo-600" />
                            <span>Same-day availability</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={onBookService}
                        className="w-full bg-gray-900 text-white py-5 rounded-[2rem] text-base font-bold hover:bg-black transition-all shadow-2xl shadow-gray-200 active:scale-[0.98] group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                           Book {firstName}
                           <HugeiconsIcon icon={Tick02Icon} size={18} className="transition-transform group-hover:scale-125" />
                        </span>
                        <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                    
                    <p className="text-[10px] font-bold text-gray-400 text-center leading-relaxed px-4 uppercase tracking-tighter opacity-60">
                        100% Refundable up to 24hrs before start
                    </p>
                </div>
            </div>
        </div>
    );
}
