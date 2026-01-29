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
                    borderRadius: '1.25rem',
                    padding: '1.5rem'
                }
            }}
        >
            <div className="relative">
                <IconButton
                    onClick={onClose}
                    style={{ position: 'absolute', right: -8, top: -8 }}
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={24} />
                </IconButton>

                <h2 className="text-lg font-bold text-text mb-4">Schedule your service of choice</h2>

                {/* Calendar */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
                        <IconButton size="small">📅</IconButton>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                            <div key={idx} className="font-semibold text-gray-text1">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center">
                        {generateCalendar().map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => day && setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
                                className={`h-8 rounded-lg text-sm ${day === selectedDate.getDate()
                                        ? 'bg-black text-white font-bold'
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
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Services</label>
                    <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    >
                        {services.map((service, idx) => (
                            <option key={idx} value={service.name}>
                                {service.name} - {service.rate}/{service.rateType}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Available time</label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="time"
                            value="13:00"
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium">
                            AI ASSIST
                        </button>
                    </div>
                </div>

                {/* Duration */}
                <div className="mb-6">
                    <label className="block text-sm font-semibold mb-2">Estimated duration for service</label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDuration(Math.max(1, duration - 1))}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold"
                        >
                            -
                        </button>
                        <span className="text-2xl font-bold">{duration}</span>
                        <span className="text-gray-text1">hours</span>
                        <button
                            onClick={() => setDuration(duration + 1)}
                            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold"
                        >
                            +
                        </button>
                        <span className="ml-auto text-xl font-bold">${(15 * duration).toFixed(2)}</span>
                    </div>
                </div>

                {/* Book Button */}
                <button
                    onClick={handleConfirm}
                    className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                    Book service
                </button>
            </div>
        </Dialog>
    );
}
