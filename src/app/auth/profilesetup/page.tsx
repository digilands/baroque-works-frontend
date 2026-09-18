"use client";

import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { useRouter } from "next/navigation";
import { nigerianStates } from "@/utils/data";
import AvatarUpload from "@/components/ui/AvatarUpload";
import LocationPicker, { type PickedLocation } from "@/components/ui/LocationPicker";
import { useCreateHandyman, useUpdateMe } from "@/hooks/useOnboarding";
import { useUser } from "@/hooks/useAuth";
import type { UploadedFile } from "@/lib/api";
import type { ExperienceLevel } from "@/lib/api";
import { ONBOARDING_CATEGORIES_KEY } from "../serviceselection/page";

const EXPERIENCE_OPTIONS: ExperienceLevel[] = ["beginner", "intermediate", "expert"];

interface ProfileSetupValues {
  name: string;
  experienceLevel: ExperienceLevel | "";
  bio: string;
  address: string;
}

function loadCategoryIds(): string[] {
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

export default function SetupProfile() {
  const router = useRouter();
  const { data: sessionUser } = useUser();
  const createHandyman = useCreateHandyman();
  const updateMe = useUpdateMe();

  const [categoryIds] = useState<string[]>(loadCategoryIds);
  const [avatar, setAvatar] = useState<UploadedFile | null>(null);
  const [picked, setPicked] = useState<PickedLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [stateName, setStateName] = useState("Lagos");
  const [lga, setLga] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (categoryIds.length === 0) router.replace("/auth/serviceselection");
  }, [categoryIds.length, router]);

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    experienceLevel: Yup.string()
      .oneOf(EXPERIENCE_OPTIONS, "Select your experience level")
      .required("Experience level is required"),
  });

  const handleSubmit = async (values: ProfileSetupValues) => {
    setFormError("");
    try {
      const experienceLevel = values.experienceLevel as ExperienceLevel;
      await createHandyman.mutateAsync({
        categoryId: categoryIds.map((type) => ({ type, experienceLevel })),
        ...(picked
          ? {
              location: {
                coordinates: [picked.longitude, picked.latitude] as [number, number],
                state: stateName,
                ...(lga.trim() ? { lga: lga.trim() } : {}),
              },
            }
          : {}),
      });

      const profileUpdate = {
        ...(values.name.trim() ? { fullname: values.name.trim() } : {}),
        ...(values.bio.trim() ? { bio: values.bio.trim() } : {}),
        ...(values.address.trim() ? { address: values.address.trim() } : {}),
        ...(avatar ? { image: { url: avatar.secureUrl || avatar.url, public_id: avatar.publicId } } : {}),
      };
      if (Object.keys(profileUpdate).length > 0) {
        await updateMe.mutateAsync(profileUpdate);
      }

      try {
        window.sessionStorage.removeItem(ONBOARDING_CATEGORIES_KEY);
      } catch {
        // ignore
      }
      router.push("/auth/additional-info");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Setup failed. Please try again.");
    }
  };

  if (categoryIds.length === 0) return null;

  const isBusy = createHandyman.isPending || updateMe.isPending;
  const mutationError = createHandyman.error ?? updateMe.error;

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-12 px-6">
      <div className="max-w-2xl w-full text-center mb-10">
        <Title>Setup profile</Title>
        <SubTitle>Provide details that will help clients find and trust you.</SubTitle>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <AvatarUpload folder="user-profiles" onUploaded={setAvatar} />
        </div>

        {(formError || mutationError) && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
            {formError || mutationError?.message}
          </div>
        )}

        <Formik
          initialValues={{
            name: sessionUser?.fullname ?? "",
            experienceLevel: "" as ExperienceLevel | "",
            bio: "",
            address: "",
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="space-y-4">
                <TextInput
                  label="Full Name"
                  name="name"
                  required
                  placeholder="e.g. Emeka John"
                />
                <SelectInput
                  label="Experience Level (applies to all selected categories)"
                  name="experienceLevel"
                  options={EXPERIENCE_OPTIONS}
                />
                <TextInput
                  label="Bio / Description"
                  name="bio"
                  multiline
                  rows={4}
                  placeholder="Tell clients about your experience and skills..."
                />
                <TextInput
                  label="Service Address"
                  name="address"
                  placeholder="e.g. No 12, Wuse Str, Abuja"
                />

                {/* Location */}
                <div className="space-y-3">
                  <p className="text-sm font-bold text-gray-700">Work location</p>
                  {!showMap ? (
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-gray-900 transition-all"
                    >
                      {picked
                        ? `${picked.label.slice(0, 48)} — change`
                        : "Pin your location on the map"}
                    </button>
                  ) : (
                    <LocationPicker
                      initial={picked}
                      onConfirm={(loc) => {
                        setPicked(loc);
                        setShowMap(false);
                      }}
                      onCancel={() => setShowMap(false)}
                    />
                  )}
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
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isBusy}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-100 disabled:opacity-50 group"
                >
                  {isBusy || isSubmitting ? "Saving..." : "Complete Setup"}
                  <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
