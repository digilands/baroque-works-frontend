import type { CreateServiceInput, PricingModel, UploadedFile } from "@/lib/api";

/** "09:00" → "09:00 AM" (swagger example format for schedule.estimatedTime). */
export function formatTime12(hhmm: string): string {
  const [hStr, m] = hhmm.split(":");
  const h = Number(hStr);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, "0")}:${m} ${suffix}`;
}

/** "10000" → "10,000" for display; the form value stays digits-only. */
export function formatWithCommas(digits: string): string {
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface BuildServicePayloadArgs {
  isEdit: boolean;
  handymanId?: string;
  categoryId: string;
  subCategory: string;
  description: string;
  price: string;
  pricingModel: PricingModel | "";
  date: string;
  estimatedTime: string;
  estimatedDuration: string;
  materialsIncluded: boolean;
  existingImages?: { url: string; public_id: string }[];
  images?: UploadedFile[];
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * Build the POST/PUT /services body so every required string is present
 * and nested objects never carry `undefined` (JSON.stringify drops those
 * keys, which Zod reports as "expected string, received undefined").
 */
export function buildServicePayload(args: BuildServicePayloadArgs): CreateServiceInput {
  const {
    isEdit,
    handymanId,
    categoryId,
    subCategory,
    description,
    price,
    pricingModel,
    date,
    estimatedTime,
    estimatedDuration,
    materialsIncluded,
    existingImages,
    images,
  } = args;

  const timeRaw = (estimatedTime ?? "").trim();
  const durationRaw = (estimatedDuration ?? "").trim();
  const normalizedTime = /^(\d{1,2}):(\d{2})$/.test(timeRaw)
    ? formatTime12(timeRaw)
    : timeRaw;

  const dateISO = new Date(date).toISOString();

  const imageItems = [
    ...(existingImages ?? []),
    ...(images ?? []).map((img) => ({
      url: img.secureUrl || img.url,
      public_id: img.publicId,
    })),
  ].filter((img): img is { url: string; public_id: string } =>
    isNonEmptyString(img.url) && isNonEmptyString(img.public_id),
  );

  const payload: CreateServiceInput = {
    category: categoryId,
    subCategory: (subCategory ?? "").trim(),
    description: (description ?? "").trim(),
    price: Number(price),
    pricingModel: pricingModel as PricingModel,
    date: dateISO,
    materials_included: materialsIncluded,
  };

  if (!isEdit && isNonEmptyString(handymanId)) {
    payload.handyman_id = handymanId;
  }

  // Only ship schedule when both fields are present — partial objects
  // fail Zod when ScheduleInputSchema requires both strings.
  if (isNonEmptyString(normalizedTime) && isNonEmptyString(durationRaw)) {
    payload.schedule = {
      estimatedTime: normalizedTime,
      estimatedDuration: durationRaw,
    };
  }

  // On edit always send `image` (including []) so removing every photo
  // clears the gallery instead of leaving stale entries on the backend.
  if (isEdit || imageItems.length > 0) {
    payload.image = imageItems;
  }

  return payload;
}
