'use client';
import React from "react";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import Tick02Icon from '@hugeicons/core-free-icons/Tick02Icon';
import { useCreateServiceBooking } from "@/hooks/useBooking";
import { redirectToMonnify, resolveMonnifyTarget } from "@/lib/monnify";
import type { CreateServiceBookingInput } from "@/lib/api";

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    onGoBack: () => void;
    /** Fully-built booking payload; null until the schedule step completes. */
    bookingInput: CreateServiceBookingInput | null;
    amount: number;
    onBooked: (bookingId?: string) => void;
}

/**
 * Monnify payment step: creates the booking (the backend creates the
 * payment intent) then redirects to Monnify's hosted checkout.
 * When the backend returns no payment target, the booking is shown as
 * confirmed with payment pending instead of redirecting.
 */
export default function PaymentModal({ open, onClose, onGoBack, bookingInput, amount, onBooked }: PaymentModalProps) {
    const booking = useCreateServiceBooking();
    const [confirmedWithoutPayment, setConfirmedWithoutPayment] = React.useState<string | undefined>(undefined);

    const handlePay = () => {
        if (!bookingInput) return;
        setConfirmedWithoutPayment(undefined);
        booking.mutate(bookingInput, {
            onSuccess: (result) => {
                const target = resolveMonnifyTarget(result.raw);
                if (target) {
                    redirectToMonnify(target);
                } else {
                    setConfirmedWithoutPayment(result.bookingId);
                    onBooked(result.bookingId);
                }
            },
        });
    };

    const isBusy = booking.isPending;

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
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    backgroundColor: 'var(--color-white-bg)'
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

                <h2 className="text-xl font-bold text-text mb-2">Payment</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Secured by Monnify — you&apos;ll complete payment on their checkout page.
                </p>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 mb-6 text-center">
                    <div className="text-4xl font-bold text-text">${amount.toFixed(2)}</div>
                    <div className="text-xs text-gray-500 mt-1">Total due now</div>
                </div>

                {booking.isError && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
                        {booking.error.message || "Booking failed. Please try again."}
                    </div>
                )}

                {confirmedWithoutPayment !== undefined && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                        <HugeiconsIcon icon={Tick02Icon} size={20} className="text-green-600 mt-0.5" />
                        <div className="text-sm text-green-800">
                            <div className="font-bold mb-1">Booking confirmed</div>
                            <div className="opacity-90">
                                No online payment was required. Your pro will be notified.
                                {confirmedWithoutPayment ? ` Ref: ${confirmedWithoutPayment.slice(-6)}` : ""}
                            </div>
                        </div>
                    </div>
                )}

                {/* Secure verification notice */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-8">
                    <div className="text-blue-600 mt-0.5">🔒</div>
                    <div className="text-xs text-blue-800">
                        <div className="font-bold mb-1">Secure Verification</div>
                        <div className="leading-tight opacity-90">Your money is saved in an Escrow Wallet and paid to the handyman when work is complete</div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onGoBack}
                        disabled={isBusy}
                        className="flex-1 border border-gray-200 dark:border-gray-600 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        Go back
                    </button>
                    {confirmedWithoutPayment !== undefined ? (
                        <button
                            onClick={onClose}
                            className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/10"
                        >
                            Done
                        </button>
                    ) : (
                        <button
                            onClick={handlePay}
                            disabled={isBusy || !bookingInput}
                            className="flex-1 bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50"
                        >
                            {isBusy ? "Creating booking…" : `Pay $${amount.toFixed(2)}`}
                        </button>
                    )}
                </div>
            </div>
        </Dialog>
    );
}
