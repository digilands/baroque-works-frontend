import "server-only";
import type { components } from "@/types/api";
import { ApiError } from "@/lib/api-errors";
import { backendGet } from "./backend";

export type ApiUser = components["schemas"]["User"];
export type ServiceCategory = components["schemas"]["ServiceCategory"];
export type ProfessionSubCategory =
  components["schemas"]["ProfessionSubCategory"];
export type ApiTag = components["schemas"]["Tag"];
export type ApiHandyman = components["schemas"]["Handyman"];
export type ApiHirer = Omit<components["schemas"]["Hirer"], "profile_completed"> & {
  /** Set by the backend when client onboarding creates the hirer profile. */
  profile_completed?: boolean;
};
export type ApiJob = components["schemas"]["Job"];
export type ApiBooking = components["schemas"]["Booking"];
export type ApiService = components["schemas"]["Service"];

/** Item shape returned by GET /services (inline schema, not $ref'd). */
export interface ServiceFeedItem {
  _id?: string;
  description?: string;
  price?: number;
  pricingModel?: string;
  distance?: number;
  subCategory?: string;
  category?: string;
  /** Service gallery images — preferred over the handyman profile photo on cards. */
  image?: { public_id?: string; url?: string }[];
  handyman?: {
    _id?: string;
    fullname?: string;
    email?: string;
    image?: { public_id?: string; url?: string }[];
    address?: string;
    phone?: string;
    rating?: number;
  };
}

export interface Pagination {
  limit?: number;
  count?: number;
  hasNextPage?: boolean;
  hasMore?: boolean;
  nextCursor?: string | null;
}

/**
 * Backend list endpoints use inconsistent envelopes (`categories`, `items`,
 * `data`, or a bare array depending on the endpoint), so try each key.
 * Exported for unit testing.
 */
export function asArray<T>(data: unknown, ...keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

/** True when the backend rejected the call for lack of a session (HTTP 401). */
export function isAuthError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

/** Current session user. Throws ApiError(401) when unauthenticated. */
export async function getSessionUser(): Promise<ApiUser> {
  const data = await backendGet<{ success: boolean; user: ApiUser }>("/auth/me");
  return data.user;
}

/** Service categories for browsing. Never throws — returns [] on failure. */
export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const data = await backendGet<unknown>("/categories?isActive=true");
    return asArray<ServiceCategory>(data, "categories", "items", "data");
  } catch {
    return [];
  }
}

/** Subcategories for one category. Never throws — returns [] on failure. */
export async function getSubcategories(
  categoryId: string,
): Promise<ProfessionSubCategory[]> {
  try {
    const data = await backendGet<unknown>(
      `/categories/subcategories?categoryId=${encodeURIComponent(categoryId)}&isActive=true`,
    );
    return asArray<ProfessionSubCategory>(data, "subcategories", "items", "data");
  } catch {
    return [];
  }
}

/** All subcategories (admin). Never throws — [] on failure. */
export async function getAllSubcategories(): Promise<ProfessionSubCategory[]> {
  try {
    const data = await backendGet<unknown>("/categories/subcategories");
    return asArray<ProfessionSubCategory>(data, "subcategories", "items", "data");
  } catch {
    return [];
  }
}

/** All tags (admin). Never throws — [] on failure. */
export async function getAllTags(): Promise<ApiTag[]> {
  try {
    const data = await backendGet<unknown>("/categories/tags");
    return asArray<ApiTag>(data, "tags", "items", "data");
  } catch {
    return [];
  }
}

export interface ServiceFeedParams {
  category?: string;
  status?: string;
  pricingModel?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  handymanId?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  cursor?: string;
  page?: number;
}

/** Home feed of services. Never throws — returns empty page on failure.
 * `unauthorized` is true when the backend demanded a session (guests),
 * so callers can render a sign-in CTA instead of a plain empty state. */
export async function getServicesFeed(
  params: ServiceFeedParams = {},
): Promise<{ items: ServiceFeedItem[]; pagination?: Pagination; unauthorized: boolean }> {
  try {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const query = search.toString();
    const data = await backendGet<{
      success: boolean;
      items: ServiceFeedItem[];
      pagination?: Pagination;
    }>(query ? `/services?${query}` : "/services");
    return { items: data.items ?? [], pagination: data.pagination, unauthorized: false };
  } catch (error) {
    return { items: [], unauthorized: isAuthError(error) };
  }
}

/** Single service detail. Throws ApiError(404) when missing. */
export async function getServiceById(id: string): Promise<ApiService> {
  const data = await backendGet<{ success: boolean; service: ApiService }>(
    `/services/${encodeURIComponent(id)}`,
  );
  return data.service;
}

export interface HandymanSearchParams {
  categoryId?: string;
  experienceLevel?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  cursor?: string;
}

/** Handyman search. Never throws — returns empty page on failure. */
export async function getHandymen(
  params: HandymanSearchParams = {},
): Promise<{ handymen: ApiHandyman[]; pagination?: Pagination }> {
  try {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const query = search.toString();
    const data = await backendGet<{
      success: boolean;
      handymen: ApiHandyman[];
      pagination?: Pagination;
    }>(query ? `/handymen?${query}` : "/handymen");
    return { handymen: data.handymen ?? [], pagination: data.pagination };
  } catch {
    return { handymen: [] };
  }
}

/** Single handyman profile. Throws ApiError(404) when missing. */
export async function getHandymanById(id: string): Promise<ApiHandyman> {
  const data = await backendGet<{ success: boolean; handyman: ApiHandyman }>(
    `/handymen/${encodeURIComponent(id)}`,
  );
  return data.handyman;
}

/** Own handyman profile, or null when none exists yet (onboarding incomplete). */
export async function getMyHandymanProfile(): Promise<ApiHandyman | null> {
  try {
    const data = await backendGet<{ success: boolean; handyman: ApiHandyman }>(
      "/handymen/me/profile",
    );
    return data.handyman ?? null;
  } catch {
    return null;
  }
}

/** Own hirer profile, or null when none exists yet. */
export async function getMyHirerProfile(): Promise<ApiHirer | null> {
  try {
    const data = await backendGet<{ success: boolean; hirer: ApiHirer }>(
      "/hirers/me/profile",
    );
    return data.hirer ?? null;
  } catch {
    return null;
  }
}

export interface JobSearchParams {
  category?: string;
  urgency?: string;
  status?: string;
  minBudget?: number;
  maxBudget?: number;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  cursor?: string;
}

/** Job listings. Never throws — returns empty page on failure. */
export async function getJobs(
  params: JobSearchParams = {},
): Promise<{ jobs: ApiJob[]; pagination?: Pagination }> {
  try {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const query = search.toString();
    const data = await backendGet<{
      success: boolean;
      jobs: ApiJob[];
      pagination?: Pagination;
    }>(query ? `/jobs?${query}` : "/jobs");
    return { jobs: data.jobs ?? [], pagination: data.pagination };
  } catch {
    return { jobs: [] };
  }
}

/** Single job. Throws ApiError(404) when missing. */
export async function getJobById(id: string): Promise<ApiJob> {
  const data = await backendGet<{ success: boolean; job: ApiJob }>(
    `/jobs/${encodeURIComponent(id)}`,
  );
  return data.job;
}

/** Hirer profile by ID. Throws ApiError(404) when missing. */
export async function getHirerById(id: string): Promise<ApiHirer> {
  const data = await backendGet<{ success: boolean; hirer: ApiHirer }>(
    `/hirers/${encodeURIComponent(id)}`,
  );
  return data.hirer;
}

/** User by ID. Throws ApiError(404) when missing. */
export async function getUserById(id: string): Promise<ApiUser> {
  const data = await backendGet<{ success: boolean; user: ApiUser }>(
    `/users/${encodeURIComponent(id)}`,
  );
  return data.user;
}

export interface BookingSearchParams {
  status?: string;
  bookingSource?: string;
  paymentStatus?: string;
  limit?: number;
  cursor?: string;
}

/** Bookings for the authenticated user. Never throws — [] on failure. */
export async function getBookings(
  params: BookingSearchParams = {},
): Promise<{ bookings: ApiBooking[]; pagination?: Pagination }> {
  try {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const query = search.toString();
    const data = await backendGet<{
      success: boolean;
      bookings: ApiBooking[];
      pagination?: Pagination;
    }>(query ? `/bookings?${query}` : "/bookings");
    return { bookings: data.bookings ?? [], pagination: data.pagination };
  } catch {
    return { bookings: [] };
  }
}

export interface UserSearchParams {
  role?: string;
  limit?: number;
  nextCursor?: string;
}

/** Paginated user list (admin). Never throws — [] on failure. */
export async function getUsersList(
  params: UserSearchParams = {},
): Promise<{ users: ApiUser[]; pagination?: Pagination }> {
  try {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") search.set(key, String(value));
    }
    const query = search.toString();
    const data = await backendGet<{
      success: boolean;
      users: ApiUser[];
      pagination?: Pagination;
    }>(query ? `/users?${query}` : "/users");
    return { users: data.users ?? [], pagination: data.pagination };
  } catch {
    return { users: [] };
  }
}
