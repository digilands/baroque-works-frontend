"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/app/ui/TextInput";
import SelectInput from "@/app/ui/SelectInput";
import Button from "@/app/ui/Button";
import DateTimePicker from "@/components/ui/DateTimePicker";
import ImageUploader from "@/components/ui/ImageUploader";
import StyledSelect from "@/components/ui/StyledSelect";
import { HugeiconsIcon } from "@hugeicons/react";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import { useCategories, useCreateService, useSubcategories, useUpdateService } from "@/hooks/useMarketplace";
import type { PricingModel } from "@/lib/api";
import type { UploadedFile } from "@/lib/api";
import { buildServicePayload, formatWithCommas } from "@/lib/service-payload";
import { isUnoptimizedSrc, normalizeImageSrc } from "@/lib/images";

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
  /** Logged-in handyman's profile id — required on create so ownership + geo stick. */
  handymanId?: string;
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

const DESCRIPTION_MAX = 500;

const validationSchema = Yup.object({
  subCategory: Yup.string().required("Subcategory is required"),
  description: Yup.string()
    .min(10, "At least 10 characters")
    .max(DESCRIPTION_MAX, `At most ${DESCRIPTION_MAX} characters`)
    .required("Description is required"),
  price: Yup.number().typeError("Enter an amount").min(1, "Must be at least ₦1").required("Price is required"),
  pricingModel: Yup.string().oneOf(PRICING_OPTIONS).required("Pricing model is required"),
  date: Yup.string().required("Service date is required"),
});

/** Handyman service creation form → POST /services (or PUT in edit mode). */
export default function ServiceCreateForm({ initial, serviceId, handymanId }: ServiceCreateFormProps) {
  const router = useRouter();
  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const [categoryId, setCategoryId] = useState(initial?.category ?? "");
  const {
    data: subcategories = [],
    isLoading: subsLoading,
    isError: subsError,
    refetch: refetchSubs,
  } = useSubcategories(categoryId || undefined);
  const createService = useCreateService();
  const updateService = useUpdateService();
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [keptImages, setKeptImages] = useState<{ url: string; public_id: string }[]>(
    initial?.existingImages ?? [],
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const isEdit = Boolean(serviceId);

  const handleSubmit = async (values: ServiceFormValues) => {
    setFormError("");
    if (!categoryId) {
      setFormError("Select a category.");
      return;
    }
    if (!values.subCategory) {
      setFormError("Select a subcategory.");
      return;
    }
    let payload;
    try {
      payload = buildServicePayload({
        isEdit,
        handymanId,
        categoryId,
        subCategory: values.subCategory,
        description: values.description,
        price: values.price,
        pricingModel: values.pricingModel,
        date: values.date,
        estimatedTime: values.estimatedTime,
        estimatedDuration: values.estimatedDuration,
        materialsIncluded: values.materialsIncluded,
        existingImages: keptImages,
        images,
      });
    } catch {
      setFormError("Pick a valid service date & time.");
      return;
    }
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
        {({ isSubmitting, setFieldValue, handleBlur, values, touched, errors }) => (
          <Form className="space-y-5">
            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Category <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <StyledSelect
                value={categoryId}
                onChange={(v) => {
                  setCategoryId(v);
                  setFieldValue("subCategory", "");
                }}
                options={categories.map((c) => ({
                  value: c._id ?? "",
                  label: c.displayName,
                }))}
                placeholder={catsLoading ? "Loading categories…" : "Select a category…"}
                aria-label="Category"
                className="w-full"
              />
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Subcategory <span className="text-red-500 ml-1 font-bold">*</span>
              </label>
              <StyledSelect
                value={values.subCategory}
                onChange={(v) => setFieldValue("subCategory", v)}
                options={subcategories.map((s) => ({
                  value: s._id ?? "",
                  label: s.displayName,
                }))}
                disabled={!categoryId || subsLoading}
                placeholder={
                  !categoryId
                    ? "Select a category first…"
                    : subsLoading
                      ? "Loading…"
                      : "Select a subcategory…"
                }
                aria-label="Subcategory"
                className="w-full"
              />
              {subsError && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium">
                  Couldn&apos;t load subcategories.{" "}
                  <button
                    type="button"
                    onClick={() => refetchSubs()}
                    className="underline font-bold"
                  >
                    Retry
                  </button>
                </p>
              )}
            </div>

            <TextInput label="Description" name="description" required multiline rows={4} maxLength={DESCRIPTION_MAX} showCount placeholder="e.g. Professional electrical wiring for residential homes" />
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <label
                  htmlFor="price"
                  className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1"
                >
                  Price (₦)<span className="text-red-500 ml-1 font-bold">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="15,000"
                  value={formatWithCommas(values.price)}
                  onChange={(e) =>
                    setFieldValue(
                      "price",
                      e.target.value.replace(/\D/g, "").slice(0, 12),
                    )
                  }
                  onBlur={handleBlur}
                  className={`w-full px-5 py-4 bg-gray-50 border rounded-2xl text-sm focus:outline-none focus:ring-4 transition-all ${
                    touched.price && errors.price
                      ? "border-red-200 focus:ring-red-100/50"
                      : "border-gray-100 focus:border-indigo-600 focus:ring-indigo-100/50"
                  }`}
                />
                {touched.price && errors.price && (
                  <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.price}</p>
                )}
              </div>
              <SelectInput label="Pricing model" name="pricingModel" required options={PRICING_OPTIONS} />
            </div>
            <DateTimePicker
              label="Available from"
              required
              withTime
              value={values.date}
              onChange={(v) => setFieldValue("date", v)}
              error={touched.date && typeof errors.date === "string" ? errors.date : undefined}
            />
            <div className="grid grid-cols-2 gap-4">
              <DateTimePicker
                label="Estimated time"
                name="estimated-time"
                timeOnly
                value={values.estimatedTime}
                onChange={(v) => setFieldValue("estimatedTime", v)}
              />
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
                Photos{keptImages.length ? ` (${keptImages.length} listed)` : ""}
              </p>
              {keptImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {keptImages.map((img) => {
                    const src = normalizeImageSrc(img.url);
                    return (
                      <div
                        key={img.public_id || img.url}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
                      >
                        <button
                          type="button"
                          onClick={() => setPreviewUrl(src)}
                          className="absolute inset-0 w-full h-full"
                          aria-label="Preview image"
                        >
                          <Image
                            src={src}
                            alt="Service photo"
                            fill
                            sizes="(max-width: 640px) 33vw, 25vw"
                            className="object-cover"
                            unoptimized={isUnoptimizedSrc(src)}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setKeptImages((prev) => prev.filter((p) => p.public_id !== img.public_id))
                          }
                          className="absolute top-1 right-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black"
                          aria-label="Remove image"
                        >
                          <HugeiconsIcon icon={Cancel01Icon} size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <ImageUploader folder="user-services" max={5} onChange={setImages} />
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

      {previewUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20"
            onClick={() => setPreviewUrl(null)}
            aria-label="Close preview"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Service photo preview"
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
