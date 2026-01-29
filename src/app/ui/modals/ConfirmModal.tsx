'use client';
import React from "react";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import Image from "next/image";
import { BookingData } from "./ScheduleModal";

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onGoBack: () => void;
    bookingData: BookingData | null;
    handymanName: string;
    handymanImage: string;
    location: string;
}

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    onGoBack,
    bookingData,
    handymanName,
    handymanImage,
    location
}: ConfirmModalProps) {
    if (!bookingData) return null;

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

                <h2 className="text-xl font-bold text-text mb-1">Confirm Request</h2>
                <p className="text-sm text-gray-text1 mb-6">Please review all details carefully</p>

                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mb-6">
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-text">${bookingData.price.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-5 gap-x-4 text-sm">
                        <div>
                            <div className="text-gray-text1 text-xs mb-1.5 font-medium uppercase tracking-wide">Worker</div>
                            <div className="font-bold text-text text-base">{handymanName.split(' ')[0]}</div>
                        </div>
                        <div>
                            <div className="text-gray-text1 text-xs mb-1.5 font-medium uppercase tracking-wide">Requested service</div>
                            <div className="font-bold text-text text-base truncate">{bookingData.service}</div>
                        </div>
                        <div>
                            <div className="text-gray-text1 text-xs mb-1.5 font-medium uppercase tracking-wide">Wednesday 17 sept 2025</div>
                            <div className="font-bold text-text text-base">{bookingData.date}</div>
                        </div>
                        <div>
                            <div className="text-gray-text1 text-xs mb-1.5 font-medium uppercase tracking-wide">Time schedule</div>
                            <div className="font-bold text-text text-base">{bookingData.duration} hours • {bookingData.time}</div>
                        </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-gray-100">
                        <div className="text-gray-text1 text-xs font-semibold mb-2">NOTE</div>
                        <div className="text-gray-text3 text-sm italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                            "The handyman will meet you at the location"
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-6">
                    <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gray-100 mb-3 border border-gray-200">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg ring-4 ring-white/30">
                                📍
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-text">📍 {location}</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mt-3 text-xs text-orange-800 font-medium flex items-center gap-2">
                        <span>⚠️</span> Tap this map to change meet location
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onGoBack}
                        className="flex-1 border border-gray-200 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                        Go back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-black text-white py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                    >
                        Proceed to pay
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
