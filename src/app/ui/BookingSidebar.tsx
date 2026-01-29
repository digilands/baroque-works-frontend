import React from "react";
import Image from "next/image";
import { HugeiconsIcon } from '@hugeicons/react';
import InformationCircleIcon from '@hugeicons/core-free-icons/InformationCircleIcon';

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
        <div className="w-full lg:w-[22rem] flex flex-col gap-8">
            {/* Services List */}
            <div>
                <h3 className="text-text font-semibold mb-4 text-base">Services by {handymanName.split(' ')[0]}</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                    {services.length > 0 ? services.map((s, idx) => (
                        <div
                            key={idx}
                            onClick={() => onServiceSelect(idx)}
                            className={`min-w-[9rem] flex flex-col gap-2.5 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedServiceIndex === idx ? 'ring-2 ring-black ring-offset-2 rounded-xl' : 'opacity-80 hover:opacity-100'
                                }`}
                        >
                            <div className="relative w-full h-[6.5rem] rounded-xl overflow-hidden shadow-sm">
                                <Image src={s.image} alt={s.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="text-text text-sm font-semibold truncate">{s.name}</h4>
                                <p className="text-text text-xs font-bold mt-0.5">{s.rate} <span className="text-gray-text1 font-normal">• {s.rateType}</span></p>
                            </div>
                        </div>
                    )) : <p className="text-gray-text1 text-sm">No specific services listed.</p>}
                </div>
            </div>

            {/* Selected Service Card */}
            {services.length > 0 && selectedService && (
                <div className="bg-white p-1 rounded-2xl">
                    <h3 className="text-text font-semibold mb-3 text-base">Selected Service</h3>
                    <div className="relative w-full h-[10rem] rounded-[1rem] overflow-hidden mb-3 shadow-sm">
                        <Image src={selectedService.image} alt={selectedService.name} fill className="object-cover" />
                    </div>
                    <h4 className="text-text text-lg font-bold mb-1">{selectedService.name}</h4>
                    <p className="text-text text-sm font-semibold">{selectedService.rate} <span className="text-gray-text1 font-normal">• {selectedService.rateType}</span></p>
                </div>
            )}

            {/* Hourly Charge Info */}
            <div className="bg-[#F7F7F7] p-4 rounded-xl flex items-start gap-3 border border-gray-100">
                <div className="mt-0.5"><HugeiconsIcon icon={InformationCircleIcon} size={18} className="text-gray-text1" /></div>
                <div>
                    <h5 className="text-text text-sm font-bold mb-1">Hourly charge</h5>
                    <p className="text-gray-text1 text-xs leading-5">Book by the hour. We&apos;ll start a timer when the job begins and charge you only for the time worked</p>
                </div>
            </div>

            {/* Total & Action */}
            <div className="pt-2">
                <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-text text-3xl font-bold tracking-tight">$30.00</span>
                    <span className="text-gray-text1 font-medium text-sm">• 2 hours minimum charge</span>
                </div>
                <button
                    onClick={onBookService}
                    className="w-full bg-black text-white py-4 rounded-[1rem] text-base font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                >
                    Book Service
                </button>
                <p className="text-gray-text1 text-[0.7rem] text-center mt-3 leading-4 px-2">
                    Cancellation and a full refund are available prior to the scheduled date.
                </p>
            </div>
        </div>
    );
}
