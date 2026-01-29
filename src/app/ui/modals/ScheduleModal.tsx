'use client';
import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

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
    time: string;
    duration: number;
    price: number;
}

export default function ScheduleModal({ open, onClose, onConfirm, services, handymanName }: ScheduleModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedService, setSelectedService] = useState(services[0]?.name || '');
    const [selectedTime, setSelectedTime] = useState('1:00 PM');
    const [duration, setDuration] = useState(2);

    const handleConfirm = () => {
        onConfirm({
            date: selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            service: selectedService,
            time: selectedTime,
            duration,
            price: 30.00
        });
    };

    // Simple calendar generation
    const generateCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
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
                style: {
                    borderRadius: '1.5rem',
                    padding: '1.5rem',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }
            }}
        >
            <div className="relative">
                <IconButton
                    onClick={onClose}
                    style={{ position: 'absolute', right: -12, top: -12 }}
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </IconButton>

                <h2 className="text-xl font-bold text-text mb-6">Schedule your service of choice</h2>

                {/* Calendar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-base font-bold">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                        <IconButton size="small">📅</IconButton>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                            <div key={idx} className="font-semibold text-gray-text1 uppercase tracking-wider">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {generateCalendar().map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                                className={`h-9 w-9 mx-auto rounded-full text-sm font-medium transition-all ${day === selectedDate.getDate()
                                    ? 'bg-black text-white shadow-md'
                                    : day
                                        ? 'hover:bg-gray-100 text-text'
                                        : ''
                                    }`}
                                disabled={!day}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Services Dropdown */}
                <div className="mb-5">
                    <label className="block text-sm font-bold mb-2">Services</label>
                    <div className="relative">
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-xl text-sm appearance-none bg-white font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        >
                            {services.map((service, idx) => (
                                <option key={idx} value={service.name}>
                                    {service.name} - {service.rate}/{service.rateType}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="mb-5">
                    <label className="block text-sm font-bold mb-2">Available time</label>
                    <div className="flex gap-3 mb-2">
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="flex-1 p-3 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                        />
                        <button className="px-5 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-md">
                            AI ASSIST
                        </button>
                    </div>
                </div>

                {/* Duration */}
                <div className="mb-8">
                    <label className="block text-sm font-bold mb-3">Estimated duration for service</label>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <button
                            onClick={() => setDuration(Math.max(1, duration - 1))}
                            className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center font-bold text-lg hover:bg-gray-50 transition-colors"
                        >
                            -
                        </button>
                        <div className="flex flex-col items-center min-w-[3rem]">
                            <span className="text-2xl font-bold">{duration}</span>
                            <span className="text-gray-text1 text-xs font-medium">hours</span>
                        </div>
                        <button
                            onClick={() => setDuration(duration + 1)}
                            className="w-10 h-10 rounded-full bg-black text-white shadow-md flex items-center justify-center font-bold text-lg hover:bg-gray-800 transition-colors"
                        >
                            +
                        </button>
                        <span className="ml-auto text-xl font-bold">${(15 * duration).toFixed(2)}</span>
                    </div>
                </div>

                {/* Book Button */}
                <button
                    onClick={handleConfirm}
                    className="w-full bg-black text-white py-4 rounded-xl text-base font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                >
                    Book service
                </button>
            </div>
        </Dialog>
    );
}
