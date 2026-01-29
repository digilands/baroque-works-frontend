'use client';
import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';

interface PaymentModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    onGoBack: () => void;
    amount: number;
}

export default function PaymentModal({ open, onClose, onConfirm, onGoBack, amount }: PaymentModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const handlePayment = () => {
        // Simulate payment processing
        setTimeout(() => {
            onConfirm();
        }, 500);
    };

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

                <h2 className="text-lg font-bold text-text mb-4">Payment Method</h2>

                {/* Payment Method Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'card'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Credit Card
                    </button>
                    <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${paymentMethod === 'transfer'
                            ? 'bg-black text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Bank Transfer
                    </button>
                </div>

                {paymentMethod === 'card' ? (
                    <div className="space-y-4 mb-6">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">Enter Card Number</label>
                            <input
                                type="text"
                                placeholder="5301 4567 3349 1003"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            />
                            <div className="flex justify-end mt-1">
                                <span className="text-orange-500 text-xl">●●</span>
                            </div>
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="CVV"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">CVV</label>
                                <input
                                    type="text"
                                    placeholder="789"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>

                        {/* Secure verification notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                            <div className="text-blue-600">🔒</div>
                            <div className="text-xs text-blue-800">
                                <div className="font-semibold mb-1">Secure Verification</div>
                                <div>Your money is saved in an Escrow Wallet and paid to the handyman when work is complete</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Account Number</label>
                            <input
                                type="text"
                                placeholder="Enter accountnumber"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onGoBack}
                        className="flex-1 border border-gray-300 py-3 rounded-lg text-sm font-medium hover:bg-gray-50"
                    >
                        Go back
                    </button>
                    <button
                        onClick={handlePayment}
                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800"
                    >
                        Pay ${amount.toFixed(2)}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
