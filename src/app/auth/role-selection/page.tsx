"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, Wrench01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { useUpdateMe } from "@/hooks/useOnboarding";

/**
 * First-time signup landing: persist the selected role before onboarding.
 */
export default function RoleSelectionPage() {
  const router = useRouter();
  const updateMe = useUpdateMe();
  const [error, setError] = useState("");

  const chooseRole = async (role: "client" | "handyman", destination: string) => {
    setError("");
    try {
      await updateMe.mutateAsync({ role });
      router.push(destination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your role. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white text-gray-900 px-6 py-12">
      <div className="max-w-2xl w-full text-center mb-12">
        <Title>How will you use Handyman?</Title>
        <SubTitle>Choose the experience that fits you. You can switch later.</SubTitle>
      </div>

      {error && <p className="mb-6 text-sm font-medium text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
        <button
          onClick={() => chooseRole("client", "/auth/onboarding/client")}
          disabled={updateMe.isPending}
          className="group text-left rounded-[2rem] border-2 border-gray-100 hover:border-indigo-600 hover:shadow-xl p-8 transition-all duration-300 bg-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <HugeiconsIcon icon={UserIcon} size={28} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">I need a pro</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            Book vetted electricians, plumbers, painters and more near you.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
            Continue as Client
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>

        <button
          onClick={() => chooseRole("handyman", "/auth/serviceselection")}
          disabled={updateMe.isPending}
          className="group text-left rounded-[2rem] border-2 border-gray-100 hover:border-indigo-600 hover:shadow-xl p-8 transition-all duration-300 bg-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <HugeiconsIcon icon={Wrench01Icon} size={28} className="text-amber-600" />
          </div>
          <h3 className="text-xl font-bold mb-2">I am a pro</h3>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6">
            Offer your trade, set your rates, and get booked by clients.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600">
            Continue as Handyman
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
}
