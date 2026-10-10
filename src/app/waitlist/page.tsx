"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Mail01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { joinWaitlist } from "@/lib/api";

export default function WaitlistPage() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState("");

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setServerError("");

    try {
      await joinWaitlist({ name: formData.name, email: formData.email });
      setStatus('success');
    } catch (error: any) {
      setStatus('error');
      setServerError(error.message || "Failed to join waitlist. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4">
      {/* Background decoration similar to HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A556]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-[#F0EAD6]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4A556] transition-colors mb-6">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Home
        </Link>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-[#FDF6E3] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8D4A2]">
              <span className="text-[#D4A556] text-2xl font-bold">✓</span>
            </div>
            <h2 className="text-2xl font-extrabold text-text mb-2">You're on the list!</h2>
            <p className="text-gray-500">We'll notify you as soon as we launch. Thank you for joining.</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-text mb-2 tracking-tight">Join the Waitlist</h1>
              <p className="text-gray-500 text-sm">Be the first to know when we launch in your area.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <HugeiconsIcon icon={UserIcon} size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'} focus:outline-none focus:border-[#D4A556] focus:ring-1 focus:ring-[#D4A556] transition-all`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <HugeiconsIcon icon={Mail01Icon} size={18} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'} focus:outline-none focus:border-[#D4A556] focus:ring-1 focus:ring-[#D4A556] transition-all`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
              </div>

              {serverError && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                  {serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#D4A556] text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-[#D4A556]/20 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Joining...' : 'Join waitlist'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </main>
  );
}
