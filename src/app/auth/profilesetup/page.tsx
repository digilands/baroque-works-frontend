"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "../../ui/TextInput";
import SelectInput from "../../ui/SelectInput";
import Button from "../../ui/Button";
import { SubTitle, Title } from "@/app/ui/Titles";
import { HugeiconsIcon, IconSvgElement } from '@hugeicons/react';
import SmileIcon from '@hugeicons/core-free-icons/SmileIcon';
import MapsLocation01Icon from '@hugeicons/core-free-icons/MapsLocation01Icon';
import { useRef } from "react";

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

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    profession: Yup.string().required("Profession is required"),
  })

  const handleSubmit = (values: ProfileSetupValues) => {
    console.log(values);
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
    <div className="min-h-screen flex flex-col items-center bg-bg py-8">
      <Title>
        Setup profile
      </Title>
      <SubTitle>
        Select services that you offer
      </SubTitle>

      <input
        type='file'
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload section */}
      <div className="flex gap-2 mb-[1rem] max-w-md px-[1rem]">
        <UploadButton text="Upload Profile picture" iconName={SmileIcon} clickHandler={handleImgSelect} />
        <UploadButton text="Select location on map" iconName={MapsLocation01Icon} clickHandler={handleLocationSelect} />
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
          <Form className="w-full max-w-md">
            <TextInput
              label="Full Name"
              name="name"
              required
              placeholder="e.g. Emeka John"
            />
            <SelectInput
              label="Profession"
              name="profession"

              options={services}
            />
            <TextInput
              label="Enter Bio/Description"
              name="bio"
              multiline
              rows={3}
              placeholder="Write a short intro about your experience..."
            />
            <TextInput
              label="Address"
              name="address"
              placeholder="Enter address (optional)"
            />

            <div className="pt-2 float-right">
              <Button type="submit" >
                {isSubmitting ? "Saving..." : "Next"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

interface UploadButtonProps {
  text: string, iconName: IconSvgElement,
  clickHandler: React.MouseEventHandler<HTMLDivElement>;
}

const UploadButton: React.FC<UploadButtonProps> = ({ text, iconName, clickHandler }) => {
  return (
    <div onClick={clickHandler} className="flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 rounded-xl w-[11rem] h-[6rem] bg-[#F2F2F2] dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition">
      <HugeiconsIcon icon={iconName} className="text-black dark:text-white" />
      <p className="text-sm max-w-[6rem] text-center">{text}</p>
    </div>
  );
}
