"use client";

import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Cancel01Icon, 
  Calendar03Icon,
  ArrowDown01Icon,
  MinusSignIcon,
  PlusSignIcon
} from '@hugeicons/core-free-icons';

interface ScheduleModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (bookingData: BookingData) => void;
    services: Array<{ name: string; rate: string; rateType: string }>;
    handymanName: string;
}

export interface BookingData {
    date: string;
    service: string;
    description: string;
    time: string;
    duration: number;
    price: number;
}

export default function ScheduleModal({ open, onClose, onConfirm, services }: ScheduleModalProps) {
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [selectedService, setSelectedService] = useState(services[0]?.name || '');
    const [description, setDescription] = useState('');
    const [selectedTime, setSelectedTime] = useState('4 : 00 PM');
    const [duration, setDuration] = useState(2);

    const timeSlots = ["9 : 00 AM", "1 : 00 PM", "4 : 00 PM"];

    const handleConfirm = () => {
        onConfirm({
            date: selectedDate.toLocaleDateString(),
            service: selectedService,
            description,
            time: selectedTime,
            duration,
            price: calculatePrice()
        });
    };

    const calculatePrice = () => {
        // Assuming base rate is $15/hr for this demo, or parse from service
        return 15 * duration;
    };

    // Calendar generation
    const generateCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // 0 = Sunday, 1 = Monday, etc. Calendar usually starts Sunday.
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const isDateDisabled = (date: Date | null) => {
        if (!date) return true;
        const current = new Date();
        current.setHours(0, 0, 0, 0);
        return date < current;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                className: "[&::-webkit-scrollbar]:hidden",
                style: {
                    borderRadius: '24px',
                    padding: '32px',
                    boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: '#FFFFFF',
                    maxWidth: '480px',
                    width: '100%',
                    margin: '16px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    maxHeight: 'calc(100vh - 32px)'
                }
            }}
        >
            <div className="relative font-sans text-gray-900">
                <button
                    onClick={onClose}
                    className="absolute -right-2 -top-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={20} />
                </button>

                <h2 className="text-[20px] font-bold mb-8">Schedule your service of choice</h2>

                {/* Calendar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-[15px] font-bold">
                            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </span>
                        <HugeiconsIcon icon={Calendar03Icon} size={20} className="text-gray-400" />
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-4">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                            <div key={day} className="text-xs font-medium text-gray-400">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
                        {generateCalendar().map((date, idx) => {
                            const isDisabled = isDateDisabled(date);
                            const isSelected = date && date.toDateString() === selectedDate.toDateString();
                            
                            return (
                                <button
                                    key={idx}
                                    disabled={isDisabled}
                                    onClick={() => date && setSelectedDate(date)}
                                    className={`
                                        w-9 h-9 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all
                                        ${!date ? 'invisible' : ''}
                                        ${isSelected ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}
                                        ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}
                                    `}
                                >
                                    {date?.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Services */}
                <div className="mb-6">
                    <label className="block text-[15px] font-medium mb-3">Services</label>
                    <div className="relative">
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl text-[13px] font-bold appearance-none cursor-pointer focus:ring-0"
                        >
                            {services.map((service, idx) => (
                                <option key={idx} value={service.name}>
                                    {service.name} &nbsp; {service.rate} • {service.rateType === 'Hourly' ? 'hour' : 'fixed'}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                             <HugeiconsIcon icon={ArrowDown01Icon} size={16} />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <textarea
                        placeholder="Write Short description of the work you want (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-24 p-4 border border-gray-200 rounded-2xl text-[13px] placeholder:text-gray-400 resize-none focus:outline-none focus:border-gray-400 transition-colors"
                    />
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                    <label className="block text-[13px] font-bold mb-3">Available time</label>
                    <div className="flex items-center gap-3">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`
                                    px-6 py-3 rounded-[14px] text-[13px] font-medium transition-all
                                    ${selectedTime === time 
                                        ? 'bg-black text-white shadow-lg shadow-black/20' 
                                        : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
                                `}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration & Price */}
                <div className="mb-8">
                     <label className="block text-[13px] font-bold mb-3">Estimated duration for service</label>
                     <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <button 
                                onClick={() => setDuration(Math.max(1, duration - 1))}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 transition-colors"
                             >
                                 <HugeiconsIcon icon={MinusSignIcon} size={16} />
                             </button>
                             <div className="flex items-baseline gap-1.5 min-w-[3rem] justify-center">
                                 <span className="text-2xl font-bold tracking-tight">{duration}</span>
                                 <span className="text-[13px] text-gray-300 font-medium">Hours</span>
                             </div>
                             <button 
                                onClick={() => setDuration(duration + 1)}
                                className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition-all shadow-lg"
                             >
                                 <HugeiconsIcon icon={PlusSignIcon} size={16} />
                             </button>
                         </div>
                         
                         <span className="text-[28px] font-bold text-gray-300">
                             ${calculatePrice().toFixed(2)}
                         </span>
                     </div>
                </div>

                {/* Commit Button */}
                <button
                    onClick={handleConfirm}
                    className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl text-[15px] font-medium hover:bg-black transition-colors shadow-xl shadow-black/10"
                >
                    Book service
                </button>
            </div>
        </Dialog>
    );
}
