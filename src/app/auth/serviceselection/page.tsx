"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useOnboardingCategories } from "@/hooks/useOnboarding";

export const ONBOARDING_CATEGORIES_KEY = "bw:onboarding:categories";
const MAX_SELECTION = 3;
const FALLBACK_IMAGE = "https://placehold.co/600x400?text=BaroqueWorks";

function loadSelected(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(ONBOARDING_CATEGORIES_KEY) ?? "[]",
    );
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export default function ServicesPage() {
  const router = useRouter();
  const { data: categories = [], isLoading, isError, refetch } = useOnboardingCategories();
  const [selected, setSelected] = useState<string[]>(loadSelected);

  const toggleService = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : prev.length >= MAX_SELECTION
          ? prev
          : [...prev, id],
    );
  };

  const handleNext = () => {
    try {
      window.sessionStorage.setItem(ONBOARDING_CATEGORIES_KEY, JSON.stringify(selected));
    } catch {
      // storage unavailable — step 2 will redirect back here
    }
    router.push("/auth/profilesetup");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-2xl w-full text-center mb-12">
        <Title>What services do you offer?</Title>
        <SubTitle>Select up to {MAX_SELECTION} categories that match your skills.</SubTitle>
      </div>

      {isLoading ? (
        <p className="text-gray-400 font-medium animate-pulse">Loading categories…</p>
      ) : isError ? (
        <div className="text-center space-y-4">
          <p className="text-red-500 font-medium">Couldn&apos;t load categories.</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full mb-20">
          {categories.map((service) => {
            const isActive = selected.includes(service._id);
            const isDisabled = !isActive && selected.length >= MAX_SELECTION;
            return (
              <div
                key={service._id}
                onClick={() => toggleService(service._id)}
                className={`group relative h-40 cursor-pointer rounded-[2rem] overflow-hidden transition-all duration-500 border-2 ${
                  isActive
                    ? "border-indigo-600 ring-4 ring-indigo-50 shadow-xl scale-[1.02]"
                    : isDisabled
                      ? "border-gray-100 opacity-50"
                      : "border-gray-100 hover:border-gray-200 hover:shadow-lg"
                }`}
              >
                <Image
                  src={service.image?.url || FALLBACK_IMAGE}
                  alt={service.displayName}
                  fill
                  className={`object-cover transition-transform duration-700 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <div className={`absolute inset-0 transition-opacity duration-500 ${
                  isActive ? "bg-indigo-600/40" : "bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90"
                }`} />

                <div className="absolute top-4 right-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive ? "bg-white text-indigo-600 scale-110" : "bg-white/20 text-white/50 scale-90"
                  }`}>
                    <HugeiconsIcon icon={Tick02Icon} size={14} />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white text-lg font-bold drop-shadow-md tracking-tight">
                    {service.displayName}
                  </p>
                  {isActive && (
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1 animate-in fade-in slide-in-from-bottom-1">
                      Selected
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-center z-50">
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className="w-full max-w-md py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group"
        >
          Next Step ({selected.length}/{MAX_SELECTION})
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
