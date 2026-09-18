"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/ui/TextInput";
import SelectInput from "@/app/ui/SelectInput";
import Button from "@/app/ui/Button";
import ImageUploader from "@/components/ui/ImageUploader";
import { useCategories, useCreateService, useSubcategories, useUpdateService } from "@/hooks/useMarketplace";
import type { PricingModel } from "@/lib/api";
import type { UploadedFile } from "@/lib/api";

const PRICING_OPTIONS: PricingModel[] = ["fixed", "hourly", "contract"];

export interface ServiceEditInitial {
  category: string;
  subCategory: string;
  description: string;
  price: number;
  pricingModel: PricingModel;
  dateISO: string;
  estimatedTime: string;
  estimatedDuration: string;
  materialsIncluded: boolean;
  existingImages: { url: string; public_id: string }[];
}

interface ServiceCreateFormProps {
  /** When set with `serviceId`, the form updates instead of creating. */
  initial?: ServiceEditInitial;
  serviceId?: string;
}

interface ServiceFormValues {
  subCategory: string;
  description: string;
  price: string;
  pricingModel: PricingModel | "";
  date: string;
  estimatedTime: string;
  estimatedDuration: string;
  materialsIncluded: boolean;
}

const validationSchema = Yup.object({
  subCategory: Yup.string().required("Subcategory is required"),
  description: Yup.string().min(10, "At least 10 characters").required("Description is required"),
  price: Yup.number().typeError("Enter an amount").min(1, "Must be at least ₦1").required("Price is required"),
  pricingModel: Yup.string().oneOf(PRICING_OPTIONS).required("Pricing model is required"),
  date: Yup.string().required("Service date is required"),
});

const selectClasses =
  "w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:border-indigo-600 focus:ring-indigo-100/50 transition-all appearance-none cursor-pointer";

/** Handyman service creation form → POST /services (or PUT in edit mode). */
export default function ServiceCreateForm({ initial, serviceId }: ServiceCreateFormProps) {
  const router = useRouter();
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const [categoryId, setCategoryId] = useState(initial?.category ?? "");
  const { data: subcategories = [], isLoading: subsLoading } = useSubcategories(categoryId || undefined);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [formError, setFormError] = useState("");
  const isEdit = Boolean(serviceId);

  const handleSubmit = async (values: ServiceFormValues) => {
    setFormError("");
    if (!categoryId) {
      setFormError("Select a category.");
      return;
    }
    const payload = {
      category: categoryId,
      subCategory: values.subCategory,
      description: values.description.trim(),
      price: Number(values.price),
      pricingModel: values.pricingModel as PricingModel,
      date: new Date(values.date).toISOString(),
      schedule: {
        ...(values.estimatedTime.trim() ? { estimatedTime: values.estimatedTime.trim() } : {}),
        ...(values.estimatedDuration.trim() ? { estimatedDuration: values.estimatedDuration.trim() } : {}),
      },
      materials_included: values.materialsIncluded,
      image: [
        ...(initial?.existingImages ?? []),
        ...images.map((img) => ({ url: img.secureUrl || img.url, public_id: img.publicId })),
      ],
    };
    try {
      if (isEdit && serviceId) {
        await updateService.mutateAsync({ id: serviceId, input: payload });
        router.push(`/services/${serviceId}`);
      } else {
        const result = await createService.mutateAsync(payload);
        router.push(result.id ? `/services/${result.id}` : "/dashboard");
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Save failed. Please try again.");
    }
  };

  const isBusy = createService.isPending || updateService.isPending;
  const mutationError = createService.error ?? updateService.error;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{isEdit ? "Edit service" : "Create a service"}</h1>
      <p className="text-sm text-gray-500 mb-8">
        {isEdit ? "Update your listing — changes go live immediately." : "List what you offer — clients can book it directly."}
      </p>

      {(formError || mutationError) && (
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl text-center font-medium">
          {formError || mutationError?.message}
        </div>
      )}

      <Formik<ServiceFormValues>
        initialValues={{
          subCategory: initial?.subCategory ?? "",
          description: initial?.description ?? "",
          price: initial?.price != null ? String(initial.price) : "",
          pricingModel: initial?.pricingModel ?? "",
          date: initial?.dateISO ?? "",
          estimatedTime: initial?.estimatedTime ?? "",
          estimatedDuration: initial?.estimatedDuration ?? "",
          materialsIncluded: initial?.materialsIncluded ?? false,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-5">
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Category <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setFieldValue("subCategory", "");
                }}
                className={selectClasses}
              >
                <option value="" disabled>
                  {catsLoading ? "Loading categories…" : "Select a category…"}
                </option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Subcategory <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <select
                name="subCategory"
                value={values.subCategory}
                disabled={!categoryId || subsLoading}
                onChange={(e) => setFieldValue("subCategory", e.target.value)}
                className={`${selectClasses} disabled:opacity-50`}
              >
                <option value="" disabled>
                  {!categoryId
                    ? "Select a category first…"
                    : subsLoading
                      ? "Loading…"
                      : "Select a subcategory…"}
                </option>
                {subcategories.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.displayName}
                  </option>
                ))}
              </select>
            </div>

            <TextInput label="Description" name="description" required multiline rows={4} placeholder="e.g. Professional electrical wiring for residential homes" />
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Price (₦)" name="price" required type="number" placeholder="15000" />
              <SelectInput label="Pricing model" name="pricingModel" required options={PRICING_OPTIONS} />
            </div>
            <TextInput label="Available from" name="date" required type="datetime-local" />
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Estimated time" name="estimatedTime" placeholder="e.g. 09:00 AM" />
              <TextInput label="Estimated duration" name="estimatedDuration" placeholder="e.g. 4 hours" />
            </div>

            <label className="flex items-center gap-3 cursor-pointer bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4">
              <input
                type="checkbox"
                checked={values.materialsIncluded}
                onChange={(e) => setFieldValue("materialsIncluded", e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-sm font-medium text-gray-700">Materials included in price</span>
            </label>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                Photos{initial?.existingImages.length ? ` (${initial.existingImages.length} already listed)` : ""}
              </p>
              <ImageUploader folder="user-services" onChange={setImages} />
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="button" variant="secondary" className="flex-1" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" loading={isSubmitting || isBusy}>
                {isEdit ? "Save changes" : "Create service"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
