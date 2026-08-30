"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon } from '@hugeicons/react';
<<<<<<< HEAD
import SmileIcon from '@hugeicons/core-free-icons/SmileIcon';
import MapsLocation01Icon from '@hugeicons/core-free-icons/MapsLocation01Icon';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ImageAdd01Icon from '@hugeicons/core-free-icons/ImageAdd01Icon';
import Location01Icon from '@hugeicons/core-free-icons/Location01Icon';
=======
import {
  SmileIcon,
  MapsLocation01Icon,
  ArrowRight01Icon,
  ImageAdd01Icon,
  Location01Icon
} from '@hugeicons/core-free-icons';
>>>>>>> 66c54f1f3fd41ac63c7062a206290f91b022890c
import { useRef } from "react";
import { useRouter } from "next/navigation";

const services = [
  "plumbing",
  "electrical",
  "carpentry",
  "painting",
  "general maintenance",
  "landscaping",
  "assembly",
  "house section"
]

interface ProfileSetupValues {
  name: string;
  profession: string;
  bio: string;
  address: string;
  profilePhoto: File | null;
}

export default function SetupProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    profession: Yup.string().required("Profession is required"),
  })

  const handleSubmit = (values: ProfileSetupValues) => {
    console.log(values);
    router.push("/auth/additional-info");
  };

  const handleImgSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("selected image: ", file)
    }
  }

  const handleLocationSelect = () => {
    console.log("Location selection clicked");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white py-12 px-6">
      <div className="max-w-2xl w-full text-center mb-10">
        <Title>Setup profile</Title>
        <SubTitle>Provide details that will help clients find and trust you.</SubTitle>
      </div>

      <input
        type='file'
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="w-full max-w-md space-y-8">
        {/* Upload section */}
        <div className="grid grid-cols-2 gap-4">
          <UploadButton
            text="Upload Photo"
            subtext="Profile picture"
            icon={ImageAdd01Icon}
            clickHandler={handleImgSelect}
          />
          <UploadButton
            text="Set Location"
            subtext="Select on map"
            icon={Location01Icon}
            clickHandler={handleLocationSelect}
          />
        </div>

        <Formik
          initialValues={{
            name: "",
            profession: "",
            bio: "",
            address: "",
            profilePhoto: null
          }}
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
                  label="Primary Profession"
                  name="profession"
                  options={services}
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
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-100 disabled:opacity-50 group"
                >
                  {isSubmitting ? "Saving..." : "Complete Setup"}
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

interface UploadButtonProps {
  text: string;
  subtext: string;
  icon: any;
  clickHandler: React.MouseEventHandler<HTMLDivElement>;
}

const UploadButton: React.FC<UploadButtonProps> = ({ text, subtext, icon, clickHandler }) => {
  return (
    <div
      onClick={clickHandler}
      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-100 rounded-[2rem] bg-gray-50 hover:bg-white hover:border-indigo-200 hover:shadow-lg cursor-pointer transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
        <HugeiconsIcon icon={icon} size={24} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
      </div>
      <p className="text-sm font-bold text-gray-900">{text}</p>
      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-1">{subtext}</p>
    </div>
  );
}
