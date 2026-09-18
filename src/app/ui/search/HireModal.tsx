"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, IconButton } from "@mui/material";
import { HugeiconsIcon } from "@hugeicons/react";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import { useAcceptJobBid } from "@/hooks/useMarketplace";

interface HireModalProps {
  open: boolean;
  onClose: () => void;
  jobId: string;
  handymanId: string;
  handymanName: string;
}

/** Hire a pro for a job posting → POST /bookings/job → bookings list. */
export default function HireModal({ open, onClose, jobId, handymanId, handymanName }: HireModalProps) {
  const router = useRouter();
  const acceptBid = useAcceptJobBid();
  const [scheduledDate, setScheduledDate] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");

  const handleHire = () => {
    setFormError("");
    const total = Number(amount);
    if (!Number.isFinite(total) || total <= 0) {
      setFormError("Enter the agreed amount.");
      return;
    }
    acceptBid.mutate(
      {
        jobId,
        handymanId,
        totalAmount: total,
        ...(scheduledDate ? { scheduledDate: new Date(scheduledDate).toISOString() } : {}),
      },
      {
        onSuccess: () => router.push("/dashboard/bookings"),
        onError: (err) => setFormError(err.message),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "1.5rem",
          padding: "1.5rem",
          backgroundColor: "var(--color-white-bg)",
        },
      }}
    >
      <div className="relative">
        <IconButton onClick={onClose} style={{ position: "absolute", right: -12, top: -12 }}>
          <HugeiconsIcon icon={Cancel01Icon} size={24} />
        </IconButton>

        <h2 className="text-xl font-bold text-text mb-1">Hire {handymanName}</h2>
        <p className="text-sm text-gray-500 mb-6">Agree the terms — a booking is created on confirm.</p>

        {(formError || acceptBid.error) && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
            {formError || acceptBid.error?.message}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <label className="block">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Agreed amount (₦)</span>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 25000"
              className="mt-1 w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Start date (optional)</span>
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="mt-1 w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none"
            />
          </label>
        </div>

        <button
          onClick={handleHire}
          disabled={acceptBid.isPending}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {acceptBid.isPending ? "Creating booking…" : `Hire ${handymanName.split(" ")[0]}`}
        </button>
      </div>
    </Dialog>
  );
}
