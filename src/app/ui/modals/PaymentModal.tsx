'use client';
import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';

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

                <h2 className="text-xl font-bold text-text mb-6">Payment Method</h2>

                {/* Payment Method Tabs */}
                <div className="flex gap-3 mb-8 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                    <button
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${paymentMethod === 'card'
                            ? 'bg-black text-white shadow-md'
                            : 'bg-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Credit Card
                    </button>
                    <button
                        onClick={() => setPaymentMethod('transfer')}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${paymentMethod === 'transfer'
                            ? 'bg-black text-white shadow-md'
                            : 'bg-transparent text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Bank Transfer
                    </button>
                </div>

                {paymentMethod === 'card' ? (
                    <div className="space-y-5 mb-8">
                        {/* Card Number */}
                        <div>
                            <label className="block text-sm font-bold mb-2">Enter Card Number</label>
                            <input
                                type="text"
                                placeholder="5301 4567 3349 1003"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl text-sm font-medium tracking-wide focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
                            />
                            <div className="flex justify-end mt-1.5">
                                <span className="text-orange-500 text-xs font-bold tracking-widest">VISA</span>
                            </div>
                        </div>

                        {/* Expiry and CVV */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-2">Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">CVV</label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    className="w-full p-4 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Secure verification notice */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                            <div className="text-blue-600 mt-0.5">🔒</div>
                            <div className="text-xs text-blue-800">
                                <div className="font-bold mb-1">Secure Verification</div>
                                <div className="leading-tight opacity-90">Your money is saved in an Escrow Wallet and paid to the handyman when work is complete</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-5 mb-8">
                        <div>
                            <label className="block text-sm font-bold mb-2">Account Number</label>
                            <input
                                type="text"
                                placeholder="Enter account number"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full p-4 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={onGoBack}
                        className="flex-1 border border-gray-200 py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                    >
                        Go back
                    </button>
                    <button
                        onClick={handlePayment}
                        className="flex-1 bg-black text-white py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10"
                    >
                        Pay ${amount.toFixed(2)}
                    </button>
                </div>
            </div>
        </Dialog>
    );
}
