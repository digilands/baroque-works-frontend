import { nigerianStates } from "@/utils/data";
import type { JoinWaitlistInput, WaitlistIntent } from "@/lib/api";

/** The 36 states + FCT, reused from the app-wide constant. */
export const WAITLIST_CITIES = nigerianStates;

export const WAITLIST_MAX_SERVICES = 20;
export const WAITLIST_MIN_NAME = 2;
export const WAITLIST_MAX_NAME = 100;
export const WAITLIST_MIN_CUSTOM_SERVICE = 2;
export const WAITLIST_MAX_CUSTOM_SERVICE = 100;

export const WAITLIST_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Nigerian mobile: `0XXXXXXXXXX` or `+234XXXXXXXXXX` (spaces/dashes/parens stripped first). */
export const WAITLIST_PHONE_RE = /^(\+?234|0)[789]\d{9}$/;

/** Remove spaces, dashes and parentheses so a phone number can be validated/sent. */
export function normalizePhone(raw: string): string {
  return (raw ?? "").replace(/[\s()\-]/g, "");
}

/** Inline error for the phone field, or `undefined` when valid. */
export function validatePhone(rawPhone: string): string | undefined {
  const phone = normalizePhone(rawPhone);
  if (!phone) return "Phone number is required";
  if (!WAITLIST_PHONE_RE.test(phone)) return "Enter a valid Nigerian phone number";
  return undefined;
}

export interface WaitlistIntentOption {
  value: WaitlistIntent;
  label: string;
  hint: string;
}

export const WAITLIST_INTENT_OPTIONS: WaitlistIntentOption[] = [
  { value: "offer", label: "Handyman", hint: "I want to offer services" },
  { value: "need", label: "Client", hint: "I need services" },
];

export interface WaitlistServiceOption {
  value: string;
  label: string;
}

/** Listed services — `value` is the exact string sent to the backend. */
export const WAITLIST_SERVICES: WaitlistServiceOption[] = [
  { value: "house section", label: "House Section" },
  { value: "electrical work", label: "Electrical Work" },
  { value: "carpentry", label: "Carpentry" },
  { value: "plumbing", label: "Plumbing" },
  { value: "general maintenance", label: "General Maintenance" },
  { value: "landscaping", label: "Landscaping" },
  { value: "assembling", label: "Assembling" },
  { value: "painting", label: "Painting" },
];

export interface WaitlistFormValues {
  name: string;
  email: string;
  phone: string;
  intent: WaitlistIntent | "";
  city: string;
  /** Selected listed service values. */
  services: string[];
  otherChecked: boolean;
  otherService: string;
}

export interface WaitlistFieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  intent?: string;
  city?: string;
  services?: string;
  otherService?: string;
}

export const EMPTY_WAITLIST_FORM: WaitlistFormValues = {
  name: "",
  email: "",
  phone: "",
  intent: "",
  city: "",
  services: [],
  otherChecked: false,
  otherService: "",
};

/** Number of services that would be submitted (listed + custom when "Other" is on). */
export function countWaitlistServices(values: WaitlistFormValues): number {
  const custom = values.otherChecked ? values.otherService.trim() : "";
  return values.services.length + (custom ? 1 : 0);
}

/** Whether "Other" is checked with a usable (trimmed) custom value. */
export function hasCustomService(values: WaitlistFormValues): boolean {
  return values.otherChecked && values.otherService.trim().length > 0;
}

/** Copy shown for the revealed "Other" field, based on the selected role. */
export function customServiceCopy(intent: WaitlistIntent | ""): {
  label: string;
  placeholder: string;
} {
  if (intent === "need") {
    return { label: "What service do you need?", placeholder: "e.g. Solar panel installation" };
  }
  if (intent === "offer") {
    return { label: "What service do you offer?", placeholder: "e.g. Solar panel installation" };
  }
  return { label: "Enter a service", placeholder: "e.g. Solar panel installation" };
}

/**
 * Build the POST /api/v1/waitlist body. Trims name/email/city, lowercases the
 * email, normalizes the phone number, and appends the trimmed custom service
 * when "Other" is checked.
 */
export function buildWaitlistPayload(values: WaitlistFormValues): JoinWaitlistInput {
  const services = [...values.services];
  if (values.otherChecked) {
    const custom = values.otherService.trim();
    if (custom) services.push(custom);
  }

  return {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: normalizePhone(values.phone),
    city: values.city,
    intent: values.intent as WaitlistIntent,
    services,
  };
}

/** Client-side validation for all six fields plus the conditional custom service. */
export function validateWaitlist(values: WaitlistFormValues): WaitlistFieldErrors {
  const errors: WaitlistFieldErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Name is required";
  } else if (
    name.length < WAITLIST_MIN_NAME ||
    name.length > WAITLIST_MAX_NAME
  ) {
    errors.name = `Name must be between ${WAITLIST_MIN_NAME} and ${WAITLIST_MAX_NAME} characters`;
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!WAITLIST_EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address";
  }

  const phoneError = validatePhone(values.phone);
  if (phoneError) {
    errors.phone = phoneError;
  }

  if (!values.intent) {
    errors.intent = "Please choose Handyman or Client";
  }

  if (!values.city) {
    errors.city = "Please select your city";
  }

  const total = countWaitlistServices(values);
  if (total === 0) {
    errors.services = "Select at least one service";
  } else if (total > WAITLIST_MAX_SERVICES) {
    errors.services = `You can select up to ${WAITLIST_MAX_SERVICES} services`;
  }

  if (values.otherChecked) {
    const custom = values.otherService.trim();
    if (!custom) {
      errors.otherService = "Describe the service";
    } else if (
      custom.length < WAITLIST_MIN_CUSTOM_SERVICE ||
      custom.length > WAITLIST_MAX_CUSTOM_SERVICE
    ) {
      errors.otherService = `Service must be between ${WAITLIST_MIN_CUSTOM_SERVICE} and ${WAITLIST_MAX_CUSTOM_SERVICE} characters`;
    }
  }

  return errors;
}

export function hasWaitlistErrors(errors: WaitlistFieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function isWaitlistValid(values: WaitlistFormValues): boolean {
  return !hasWaitlistErrors(validateWaitlist(values));
}

const FIELD_KEYWORDS: { field: keyof WaitlistFieldErrors; keywords: string[] }[] = [
  { field: "name", keywords: ["name"] },
  { field: "email", keywords: ["email"] },
  { field: "phone", keywords: ["phone", "mobile"] },
  { field: "intent", keywords: ["intent", "role"] },
  { field: "city", keywords: ["city", "state"] },
  { field: "otherService", keywords: ["custom", "other"] },
  { field: "services", keywords: ["service"] },
];

/**
 * Best-effort mapping of a backend 400 `errors[]` array onto form fields.
 * Messages that mention a known field name are attached inline; the rest are
 * returned separately so they can be shown in a general error block.
 */
export function mapServerErrors(
  errorMessages: string[],
  options: { otherChecked?: boolean } = {},
): { fieldErrors: WaitlistFieldErrors; generalErrors: string[] } {
  const fieldErrors: WaitlistFieldErrors = {};
  const generalErrors: string[] = [];

  for (const raw of errorMessages) {
    const text = String(raw ?? "").trim();
    if (!text) continue;

    const lower = text.toLowerCase();
    const match = FIELD_KEYWORDS.find(({ field, keywords }) => {
      if (field === "otherService" && !options.otherChecked) return false;
      return keywords.some((keyword) => lower.includes(keyword));
    });

    if (match && !fieldErrors[match.field]) {
      fieldErrors[match.field] = text;
    } else {
      generalErrors.push(text);
    }
  }

  return { fieldErrors, generalErrors };
}
