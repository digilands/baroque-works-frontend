"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/ui/TextInput";
import SelectInput from "@/app/ui/SelectInput";
import Button from "@/app/ui/Button";
import LocationPicker, {
  type PickedLocation,
} from "@/components/ui/LocationPicker";
import {
  useCategories,
  useCreateJob,
  useUpdateJob,
} from "@/hooks/useMarketplace";
import type { JobUrgency } from "@/lib/api";
import ImageUploader from "@/components/ui/ImageUploader";
import type { UploadedFile } from "@/lib/api";

const URGENCY_OPTIONS: JobUrgency[] = ["URGENT", "NORMAL", "FLEXIBLE"];

interface JobFormValues {
  title: string;
  description: string;
  category: string;
  minBudget: string;
  maxBudget: string;
  urgency: JobUrgency | "";
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(5, "At least 5 characters")
    .max(100, "At most 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(20, "At least 20 characters")
    .max(2000, "At most 2000 characters")
    .required("Description is required"),
  category: Yup.string().required("Category is required"),
  minBudget: Yup.number()
    .typeError("Enter an amount")
    .min(0, "Must be positive")
    .required("Min budget is required"),
  maxBudget: Yup.number()
    .typeError("Enter an amount")
    .min(Yup.ref("minBudget"), "Max must be at least min")
    .required("Max budget is required"),
  urgency: Yup.string().oneOf(URGENCY_OPTIONS).required("Urgency is required"),
});

/** Client job posting form → POST /jobs (or PATCH in edit mode). */
export interface JobEditInitial {
  title: string;
  description: string;
  category: string;
  minBudget: number;
  maxBudget: number;
  urgency: JobUrgency;
  location: { latitude: number; longitude: number } | null;
}

export default function JobCreateForm({
  initial,
  jobId,
}: {
  initial?: JobEditInitial;
  jobId?: string;
}) {
  const router = useRouter();
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const [picked, setPicked] = useState<PickedLocation | null>(
    initial?.location ? { ...initial.location, label: "Job location" } : null,
  );
  const [showMap, setShowMap] = useState(false);
  const [formError, setFormError] = useState("");
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const isEdit = Boolean(jobId);
  const isBusy = createJob.isPending || updateJob.isPending;
  const mutationError = createJob.error ?? updateJob.error;

  const handleSubmit = async (values: JobFormValues) => {
    setFormError("");
    if (!picked) {
      setFormError("Pin the job location on the map.");
      return;
    }
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      // Jobs persist the selected ServiceCategory ObjectId. The backend DTO
      // should align its validation with the Mongoose schema for this field.
      category: values.category,
      budget: { min: Number(values.minBudget), max: Number(values.maxBudget) },
      urgency: values.urgency as JobUrgency,
      ...(images.length > 0 && {
        image: images.map((file) => ({
          url: file.secureUrl || file.url,
          public_id: file.publicId,
        })),
      }),
      location: {
        coordinates: [picked.longitude, picked.latitude] as [number, number],
      },
    };
    try {
      if (isEdit && jobId) {
        await updateJob.mutateAsync({ id: jobId, input: payload });
        router.push(`/dashboard/jobs/${jobId}`);
      } else {
        const created = await createJob.mutateAsync(payload);
        router.push(created.id ? `/dashboard/jobs/${created.id}` : "/dashboard/jobs");
      }
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Save failed. Please try again.",
      );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        {isEdit ? "Edit job" : "Post a job"}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        {isEdit
          ? "Update the details — pros see changes immediately."
          : "Describe the work — pros nearby can respond."}
      </p>

      {(formError || mutationError) && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {formError || mutationError?.message}
        </div>
      )}

      <Formik<JobFormValues>
        initialValues={{
          title: initial?.title ?? "",
          description: initial?.description ?? "",
          category: initial?.category ?? "",
          minBudget:
            initial?.minBudget != null ? String(initial.minBudget) : "",
          maxBudget:
            initial?.maxBudget != null ? String(initial.maxBudget) : "",
          urgency: initial?.urgency ?? "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-5">
            <TextInput
              label="Job title"
              name="title"
              required
              placeholder="e.g. Fix leaking kitchen pipe"
            />
            <TextInput
              label="Description"
              name="description"
              required
              multiline
              rows={5}
              placeholder="What needs doing? Materials provided? Access notes?"
            />
            <SelectInput
              label="Category"
              name="category"
              required
              placeholder={
                catsLoading ? "Loading categories…" : "Select a category…"
              }
              options={categories.flatMap((c) =>
                c._id
                  ? [{ value: c._id, label: c.displayName }]
                  : [],
              )}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Photos (up to 3)</p>
              <ImageUploader folder="user-jobs" max={3} onChange={setImages} onUploadingChange={setIsUploadingImages} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="Min budget (₦)"
                name="minBudget"
                required
                type="number"
                placeholder="5000"
              />
              <TextInput
                label="Max budget (₦)"
                name="maxBudget"
                required
                type="number"
                placeholder="15000"
              />
            </div>
            <SelectInput
              label="Urgency"
              name="urgency"
              required
              options={URGENCY_OPTIONS}
            />

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Job location{" "}
                <span className="text-red-500 ml-1 font-bold">*</span>
              </p>
              {!showMap ? (
                <button
                  type="button"
                  onClick={() => setShowMap(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:border-indigo-400 hover:text-gray-900 transition-all"
                >
                  {picked
                    ? `${picked.label.slice(0, 52)} — change`
                    : "Pin the job location on the map"}
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
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                loading={isSubmitting || isBusy || isUploadingImages}
              >
                {isEdit ? "Save changes" : "Post job"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
