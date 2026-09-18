"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { nigerianStates } from "@/utils/data";
import { useCreateHirer, useUpdateMe } from "@/hooks/useOnboarding";
import type { PreferredLanguage, UrgencyTendency } from "@/lib/api";

const LANGUAGES: PreferredLanguage[] = ["english", "hausa", "igbo", "yoruba", "fulani"];

const URGENCY_OPTIONS: { value: UrgencyTendency; title: string; hint: string }[] = [
  { value: "PLANNED", title: "Planned", hint: "I schedule work ahead of time" },
  { value: "EMERGENCY", title: "Emergency", hint: "I usually need help fast" },
  { value: "FLEXIBLE", title: "Flexible", hint: "Either works for me" },
];

export default function ClientOnboardingPage() {
  const router = useRouter();
  const createHirer = useCreateHirer();
  const updateMe = useUpdateMe();

  const [organizationName, setOrganizationName] = useState("");
  const [language, setLanguage] = useState<PreferredLanguage>("english");
  const [urgency, setUrgency] = useState<UrgencyTendency>("FLEXIBLE");
  const [stateName, setStateName] = useState("Lagos");
  const [lga, setLga] = useState("");
  const [pushNotification, setPushNotification] = useState(false);
  const [formError, setFormError] = useState("");

  const isBusy = createHirer.isPending || updateMe.isPending;

  const handleSubmit = async () => {
    setFormError("");
    try {
      await createHirer.mutateAsync({
        ...(organizationName.trim() ? { organizationName: organizationName.trim() } : {}),
        preferences: { preferredLanguage: language, urgencyTendency: urgency },
      });
      await updateMe.mutateAsync({
        location: {
          state: stateName,
          ...(lga.trim() ? { lga: lga.trim() } : {}),
        },
      });
      if (pushNotification && typeof window !== "undefined" && "Notification" in window) {
        try {
          await Notification.requestPermission();
        } catch {
          // non-blocking
        }
      }
      router.push("/dashboard");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Setup failed. Please try again.");
    }
  };

  const handleSkip = () => router.push("/dashboard");

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-2xl w-full text-center mb-10">
        <Title>Tell us about yourself</Title>
        <SubTitle>We&apos;ll match you with pros who fit how you hire.</SubTitle>
      </div>

      <div className="w-full max-w-md space-y-8">
        {(formError || createHirer.error || updateMe.error) && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
            {formError || createHirer.error?.message || updateMe.error?.message}
          </div>
        )}

        {/* Organization */}
        <label className="block">
          <span className="text-sm font-bold text-gray-700">Organization (optional)</span>
          <input
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="e.g. Adaeze Ventures"
            className="mt-2 w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none placeholder:text-gray-300"
          />
        </label>

        {/* Language */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">Preferred language</p>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-bold capitalize border-2 transition-all ${
                  language === lang
                    ? "bg-gray-900 border-gray-900 text-white"
                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Urgency */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3">How do you usually hire?</p>
          <div className="space-y-3">
            {URGENCY_OPTIONS.map((opt) => {
              const active = urgency === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setUrgency(opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                    active ? "border-indigo-600 bg-indigo-50/40" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    active ? "bg-indigo-600 text-white" : "bg-gray-100 text-transparent"
                  }`}>
                    <HugeiconsIcon icon={Tick02Icon} size={14} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-gray-900">{opt.title}</span>
                    <span className="block text-xs text-gray-500 font-medium">{opt.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">State</span>
            <select
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              className="mt-1 w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none"
            >
              {nigerianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">LGA</span>
            <input
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              placeholder="e.g. Ikeja"
              className="mt-1 w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none placeholder:text-gray-300"
            />
          </label>
        </div>

        {/* Notifications */}
        <label className="flex items-center justify-between cursor-pointer" onClick={() => setPushNotification(!pushNotification)}>
          <span className="text-sm font-medium text-gray-700">Booking updates via push notification</span>
          <span className="relative inline-flex items-center">
            <span className={`w-11 h-6 rounded-full transition-colors duration-200 ${pushNotification ? "bg-black" : "bg-gray-300"}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${pushNotification ? "translate-x-5" : ""}`} />
            </span>
          </span>
        </label>

        <div className="flex gap-4 pt-2">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-4 border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isBusy}
            className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50 group"
          >
            {isBusy ? "Saving…" : "Finish"}
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
