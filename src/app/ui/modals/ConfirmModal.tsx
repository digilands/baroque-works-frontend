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

                <h2 className="text-lg font-bold text-text mb-2">Confirm Request</h2>
                <p className="text-sm text-gray-text1 mb-4">Please review all details carefully</p>

                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="text-center mb-4">
                        <div className="text-3xl font-bold text-text">${bookingData.price.toFixed(2)}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="text-gray-text1 text-xs mb-1">Worker</div>
                            <div className="font-semibold text-text">{handymanName.split(' ')[0]}</div>
                        </div>
                        <div>
                            <div className="text-gray-text1 text-xs mb-1">Requested service</div>
                            <div className="font-semibold text-text">{bookingData.service}</div>
                        </div>
                        <div>
                            <div className="text-gray-text1 text-xs mb-1">Wednesday 17 sept 2025</div>
                            <div className="font-semibold text-text">{bookingData.date}</div>
                        </div>
                        <div>
                            <div className="text-gray-text1 text-xs mb-1">Time schedule</div>
                            <div className="font-semibold text-text">{bookingData.duration} hours • {bookingData.time}</div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-gray-text1 text-xs mb-2">No description</div>
                        <div className="text-gray-text1 text-xs italic">The handyman will meet you at the location</div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mb-4">
                    <div className="relative w-full h-32 rounded-xl overflow-hidden bg-gray-100 mb-2">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                                📍
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-text">📍 {location}</span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 mt-2 text-xs text-yellow-800">
                        ⚠️ Tap this map to change meet location
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onGoBack}
                        className="flex-1 border border-gray-300 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Go back
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                        Proceed to pay
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
