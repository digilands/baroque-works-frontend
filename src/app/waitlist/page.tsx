"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Mail01Icon, UserIcon } from "@hugeicons/core-free-icons";
import { joinWaitlist } from "@/lib/api";
import { ApiError } from "@/lib/api-errors";
import {
  EMPTY_WAITLIST_FORM,
  WAITLIST_CITIES,
  WAITLIST_INTENT_OPTIONS,
  WAITLIST_MAX_SERVICES,
  WAITLIST_SERVICES,
  buildWaitlistPayload,
  countWaitlistServices,
  customServiceCopy,
  hasWaitlistErrors,
  mapServerErrors,
  validateWaitlist,
  type WaitlistFieldErrors,
  type WaitlistFormValues,
} from "@/lib/waitlist";
import type { WaitlistIntent } from "@/lib/api";

function fieldClass(hasError: boolean, extra = "") {
  return `w-full px-4 py-3 rounded-xl border ${
    hasError ? "border-red-500 bg-red-50/50" : "border-gray-200 bg-gray-50/50"
  } focus:outline-none focus:border-[#D4A556] focus:ring-1 focus:ring-[#D4A556] transition-all ${extra}`;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-red-500 text-xs mt-1 font-medium">{message}</p>;
}

export default function WaitlistPage() {
  const [values, setValues] = useState<WaitlistFormValues>(EMPTY_WAITLIST_FORM);
  const [errors, setErrors] = useState<WaitlistFieldErrors>({});
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const selectedCount = countWaitlistServices(values);
  const otherCopy = customServiceCopy(values.intent);

  const clearError = (field: keyof WaitlistFieldErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleIntentChange = (intent: WaitlistIntent) => {
    setValues((prev) => ({ ...prev, intent }));
    clearError("intent");
  };

  const toggleService = (value: string) => {
    setValues((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter((s) => s !== value)
        : [...prev.services, value],
    }));
    clearError("services");
  };

  const toggleOther = (checked: boolean) => {
    setValues((prev) => ({ ...prev, otherChecked: checked }));
    clearError("services");
    if (!checked) clearError("otherService");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const clientErrors = validateWaitlist(values);
    setErrors(clientErrors);
    setGeneralErrors([]);
    setServerError("");
    if (hasWaitlistErrors(clientErrors)) return;

    setStatus("loading");
    try {
      await joinWaitlist(buildWaitlistPayload(values));
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      const apiError = error instanceof ApiError ? error : null;
      const statusCode = apiError?.status ?? 0;

      if (statusCode === 409) {
        setServerError("This email is already on the waitlist.");
        return;
      }

      if (statusCode === 400) {
        const details = apiError?.details as { errors?: unknown[] } | undefined;
        const messages = Array.isArray(details?.errors)
          ? details.errors.map((item) => String(item))
          : [];
        if (messages.length > 0) {
          const mapped = mapServerErrors(messages, {
            otherChecked: values.otherChecked,
          });
          setErrors(mapped.fieldErrors);
          setGeneralErrors(mapped.generalErrors);
          return;
        }
        setServerError(apiError?.message || "Please check the form and try again.");
        return;
      }

      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFCF8] flex items-center justify-center p-4">
      {/* Background decoration similar to HeroSection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4A556]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-lg bg-white p-8 rounded-3xl shadow-xl border border-[#F0EAD6]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#D4A556] transition-colors mb-6">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          Back to Home
        </Link>

        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-[#FDF6E3] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E8D4A2]">
              <span className="text-[#D4A556] text-2xl font-bold">✓</span>
            </div>
            <h2 className="text-2xl font-extrabold text-text mb-2">You&apos;re on the waitlist!</h2>
            <p className="text-gray-500">We&apos;ll notify you as soon as we launch. Thank you for joining.</p>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-text mb-2 tracking-tight">Join the Waitlist</h1>
              <p className="text-gray-500 text-sm">Be the first to know when we launch in your area.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label htmlFor="waitlist-name" className="block text-sm font-semibold text-text mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <HugeiconsIcon icon={UserIcon} size={18} />
                  </div>
                  <input
                    id="waitlist-name"
                    type="text"
                    value={values.name}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, name: e.target.value }));
                      clearError("name");
                    }}
                    className={fieldClass(Boolean(errors.name), "pl-10")}
                    placeholder="John Doe"
                    aria-invalid={Boolean(errors.name)}
                  />
                </div>
                <FieldError message={errors.name} />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="waitlist-email" className="block text-sm font-semibold text-text mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <HugeiconsIcon icon={Mail01Icon} size={18} />
                  </div>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={values.email}
                    onChange={(e) => {
                      setValues((prev) => ({ ...prev, email: e.target.value }));
                      clearError("email");
                    }}
                    className={fieldClass(Boolean(errors.email), "pl-10")}
                    placeholder="john@example.com"
                    aria-invalid={Boolean(errors.email)}
                  />
                </div>
                <FieldError message={errors.email} />
              </div>

              {/* Intent */}
              <fieldset>
                <legend className="block text-sm font-semibold text-text mb-1.5">I am a…</legend>
                <div className="grid grid-cols-2 gap-3">
                  {WAITLIST_INTENT_OPTIONS.map((opt) => {
                    const active = values.intent === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`cursor-pointer rounded-xl border p-3 text-left transition-all ${
                          active
                            ? "border-[#D4A556] bg-[#FDF6E3]"
                            : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="intent"
                          value={opt.value}
                          checked={active}
                          onChange={() => handleIntentChange(opt.value)}
                          className="sr-only"
                        />
                        <span className="block text-sm font-bold text-text">{opt.label}</span>
                        <span className="block text-xs text-gray-500">{opt.hint}</span>
                      </label>
                    );
                  })}
                </div>
                <FieldError message={errors.intent} />
              </fieldset>

              {/* City */}
              <div>
                <label htmlFor="waitlist-city" className="block text-sm font-semibold text-text mb-1.5">
                  City
                </label>
                <select
                  id="waitlist-city"
                  value={values.city}
                  onChange={(e) => {
                    setValues((prev) => ({ ...prev, city: e.target.value }));
                    clearError("city");
                  }}
                  className={fieldClass(Boolean(errors.city))}
                  aria-invalid={Boolean(errors.city)}
                >
                  <option value="">Select your state</option>
                  {WAITLIST_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.city} />
              </div>

              {/* Services */}
              <fieldset>
                <legend className="block text-sm font-semibold text-text mb-1.5">Services</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WAITLIST_SERVICES.map((svc) => {
                    const checked = values.services.includes(svc.value);
                    return (
                      <label
                        key={svc.value}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                          checked
                            ? "border-[#D4A556] bg-[#FDF6E3]"
                            : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          value={svc.value}
                          checked={checked}
                          onChange={() => toggleService(svc.value)}
                          className="w-4 h-4 accent-[#D4A556]"
                        />
                        <span className="text-sm font-medium text-text">{svc.label}</span>
                      </label>
                    );
                  })}
                </div>

                <label
                  className={`mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    values.otherChecked
                      ? "border-[#D4A556] bg-[#FDF6E3]"
                      : "border-gray-200 bg-gray-50/50 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={values.otherChecked}
                    onChange={(e) => toggleOther(e.target.checked)}
                    className="w-4 h-4 accent-[#D4A556]"
                  />
                  <span className="text-sm font-medium text-text">Other</span>
                </label>

                <AnimatePresence initial={false}>
                  {values.otherChecked && (
                    <motion.div
                      key="other-service"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-3">
                        <label htmlFor="waitlist-other-service" className="block text-sm font-semibold text-text mb-1.5">
                          {otherCopy.label}
                        </label>
                        <input
                          id="waitlist-other-service"
                          type="text"
                          value={values.otherService}
                          onChange={(e) => {
                            setValues((prev) => ({ ...prev, otherService: e.target.value }));
                            clearError("otherService");
                          }}
                          placeholder={otherCopy.placeholder}
                          maxLength={100}
                          className={fieldClass(Boolean(errors.otherService))}
                          aria-invalid={Boolean(errors.otherService)}
                        />
                        <FieldError message={errors.otherService} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedCount} / {WAITLIST_MAX_SERVICES} selected
                </p>
                <FieldError message={errors.services} />
              </fieldset>

              {serverError && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium">
                  {serverError}
                </div>
              )}

              {generalErrors.length > 0 && (
                <ul className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium space-y-1 list-disc list-inside">
                  {generalErrors.map((message, index) => (
                    <li key={`${message}-${index}`}>{message}</li>
                  ))}
                </ul>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-[#D4A556] text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 hover:shadow-lg hover:shadow-[#D4A556]/20 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Joining…" : "Join waitlist"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </main>
  );
}
