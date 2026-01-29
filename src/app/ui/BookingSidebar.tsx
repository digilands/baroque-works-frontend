import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import { InformationCircleIcon } from '@hugeicons/core-free-icons';

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

    return (
        <div className="w-full lg:w-[22rem] flex flex-col gap-6">
            {/* Services List */}
            <div>
                <h3 className="text-text font-medium mb-3">Services by {handymanName.split(' ')[0]}</h3>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {services.length > 0 ? services.map((s, idx) => (
                        <div
                            key={idx}
                            onClick={() => onServiceSelect(idx)}
                            className={`min-w-[8rem] h-[10rem] flex flex-col gap-2 cursor-pointer transition-all ${selectedServiceIndex === idx ? 'ring-2 ring-black ring-offset-2 rounded-xl' : ''
                                }`}
                        >
                            <div className="relative w-full h-[6rem] rounded-xl overflow-hidden">
                                <Image src={s.image} alt={s.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="text-text text-xs font-medium truncate">{s.name}</h4>
                                <p className="text-text text-xs font-bold">{s.rate} <span className="text-gray-text1 font-normal">• {s.rateType}</span></p>
                            </div>
                        </div>
                    )) : <p className="text-gray-text1 text-xs">No specific services listed.</p>}
                </div>
            </div>

            {/* Selected Service Card */}
            {services.length > 0 && selectedService && (
                <div>
                    <h3 className="text-text font-medium mb-3">Selected Service</h3>
                    <div className="relative w-full h-[8rem] rounded-[1.25rem] overflow-hidden mb-2">
                        <Image src={selectedService.image} alt={selectedService.name} fill className="object-cover" />
                    </div>
                    <h4 className="text-text text-sm font-semibold">{selectedService.name}</h4>
                    <p className="text-text text-xs font-semibold">{selectedService.rate} <span className="text-gray-text1 font-normal">• {selectedService.rateType}</span></p>
                </div>
            )}

            {/* Hourly Charge Info */}
            <div className="bg-[#F2F2F2] p-3 rounded-xl flex items-start gap-2">
                <div className="mt-[2px]"><HugeiconsIcon icon={InformationCircleIcon} size={16} className="text-gray-text1" /></div>
                <div>
                    <h5 className="text-text text-xs font-semibold">Hourly charge</h5>
                    <p className="text-gray-text1 text-[0.65rem] leading-4">Book by the hour. We&apos;ll start a timer when the job begins and charge you only for the time worked</p>
                </div>
            </div>

            {/* Total & Action */}
            <div>
                <p className="text-text text-sm font-bold mb-3">$30.00 <span className="text-gray-text1 font-normal text-xs">• 2 hours minimum charge</span></p>
                <button
                    onClick={onBookService}
                    className="w-full bg-black text-white py-3 rounded-[0.75rem] text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                    Book Service
                </button>
                <p className="text-gray-text1 text-[0.65rem] text-center mt-2 leading-3 px-4">
                    Cancellation and a full refund are available prior to the scheduled date.
                </p>
            </div>
        </div>
    );
}
