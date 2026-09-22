"use client";

import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/ui/TextInput";
import SelectInput from "@/app/ui/SelectInput";
import Button from "@/app/ui/Button";
import AvatarUpload from "@/components/ui/AvatarUpload";
import { nigerianStates } from "@/utils/data";
import { useUpdateHandyman } from "@/hooks/useMarketplace";
import { useUpdateMe } from "@/hooks/useOnboarding";
import type { UploadedFile } from "@/lib/api";

export interface ProfileEditInitial {
  role: string;
  fullname: string;
  email: string;
  phone: string;
  bio: string;
  address: string;
  imageUrl: string;
  state: string;
  lga: string;
  availability: "available" | "unavailable";
}

interface ProfileEditFormProps {
  initial: ProfileEditInitial;
}

const phonePattern = /^\+?\d{10,14}$/;

const validationSchema = Yup.object({
  fullname: Yup.string().required("Full name is required"),
  phone: Yup.string().matches(phonePattern, "Enter a valid phone number").optional(),
});

/** Edit own profile — user fields for everyone, handyman extras by role. */
export default function ProfileEditForm({ initial }: ProfileEditFormProps) {
  const updateMe = useUpdateMe();
  const updateHandyman = useUpdateHandyman();
  const [avatar, setAvatar] = useState<UploadedFile | null>(null);
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  const isHandyman = initial.role === "handyman";
  const isBusy = updateMe.isPending || updateHandyman.isPending;

  const handleSubmit = async (values: {
    fullname: string;
    phone: string;
    bio: string;
    address: string;
    state: string;
    lga: string;
    availability: "available" | "unavailable";
  }) => {
    setFormError("");
    setSaved(false);
    try {
      await updateMe.mutateAsync({
        ...(values.fullname.trim() ? { fullname: values.fullname.trim() } : {}),
        ...(values.phone.trim() ? { phone: values.phone.trim() } : {}),
        ...(values.bio.trim() ? { bio: values.bio.trim() } : {}),
        ...(values.address.trim() ? { address: values.address.trim() } : {}),
        location: {
          state: values.state,
          ...(values.lga.trim() ? { lga: values.lga.trim() } : {}),
        },
        ...(avatar
          ? { image: { url: avatar.secureUrl || avatar.url, public_id: avatar.publicId } }
          : {}),
      });
      if (isHandyman) {
        await updateHandyman.mutateAsync({
          availability: { status: values.availability },
          location: {
            state: values.state,
            ...(values.lga.trim() ? { lga: values.lga.trim() } : {}),
          },
        });
      }
      setSaved(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Update failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile</h1>
      <p className="text-sm text-gray-500 mb-8">{initial.email}</p>

      <div className="flex justify-center mb-8">
        <AvatarUpload folder="user-profiles" initialUrl={initial.imageUrl || undefined} onUploaded={setAvatar} />
      </div>

      {(formError || updateMe.error || updateHandyman.error) && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {formError || updateMe.error?.message || updateHandyman.error?.message}
        </div>
      )}
      {saved && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 text-sm rounded-xl text-center font-bold">
          Profile updated.
        </div>
      )}

      <Formik
        initialValues={{
          fullname: initial.fullname,
          phone: initial.phone,
          bio: initial.bio,
          address: initial.address,
          state: initial.state || "Lagos",
          lga: initial.lga,
          availability: initial.availability,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <TextInput label="Full Name" name="fullname" required placeholder="e.g. Emeka John" />
            <TextInput label="Phone" name="phone" type="tel" placeholder="+234…" />
            <TextInput label="Bio" name="bio" multiline rows={4} placeholder="Tell clients about yourself…" />
            <TextInput label="Address" name="address" placeholder="e.g. No 12, Wuse Str, Abuja" />
            <div className="grid grid-cols-2 gap-4">
              <SelectInput label="State" name="state" options={nigerianStates} />
              <TextInput label="LGA" name="lga" placeholder="e.g. Ikeja" required={false} />
            </div>
            {isHandyman && (
              <SelectInput label="Availability" name="availability" options={["available", "unavailable"]} />
            )}
            <div className="pt-2">
              <Button type="submit" className="w-full py-4" loading={isSubmitting || isBusy}>
                Save changes
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
