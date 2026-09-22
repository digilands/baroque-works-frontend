import { internalApi } from './auth';
import type { User, LoginCredentials, SignupCredentials } from './auth';
import { ApiError, toApiError } from './api-errors';

export async function getMe(): Promise<User> {
  try {
    const { data } = await internalApi.get('/auth/me');
    return data.user;
  } catch (error) {
    throw toApiError(error, 'Failed to fetch user');
  }
}

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const { data } = await internalApi.post('/auth/login', credentials);
    if (!data.success || !data.user) {
      throw new ApiError(401, 'LOGIN_FAILED', data.message || 'Login failed');
    }
    return data.user;
  } catch (error) {
    throw toApiError(error, 'Login failed');
  }
}

export async function logout(): Promise<void> {
  try {
    await internalApi.post('/auth/logout');
  } catch (error) {
    throw toApiError(error, 'Logout failed');
  }
}

export async function signup(credentials: SignupCredentials): Promise<void> {
  try {
    const { data } = await internalApi.post('/auth/signup', credentials);
    if (!data.success) {
      throw new ApiError(400, 'SIGNUP_FAILED', data.message || 'Signup failed');
    }
  } catch (error) {
    throw toApiError(error, 'Signup failed');
  }
}

export interface CreateServiceBookingInput {
  serviceId: string;
  handymanId: string;
  scheduledDate?: string;
  totalAmount?: number;
}

export interface CreateServiceBookingResult {
  bookingId?: string;
  raw: unknown;
}

export async function createServiceBooking(
  input: CreateServiceBookingInput,
): Promise<CreateServiceBookingResult> {
  try {
    const { data } = await internalApi.post('/bookings/service', input);
    if (!data?.success) {
      throw new ApiError(400, 'BOOKING_FAILED', data?.message || 'Booking failed');
    }
    const booking = data.booking as { _id?: string } | undefined;
    return { bookingId: booking?._id, raw: data };
  } catch (error) {
    throw toApiError(error, 'Booking failed');
  }
}

/** Cloudinary folders used by the backend upload endpoints. */
export type UploadFolder =
  | 'user-profiles'
  | 'user-services'
  | 'user-jobs'
  | 'user-videos'
  | 'service-categories';

export interface UploadedFile {
  publicId: string;
  url: string;
  secureUrl: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  resourceType?: string;
}

function toUploadedFiles(payload: unknown): UploadedFile[] {
  const data = (payload as { data?: UploadedFile | UploadedFile[] })?.data;
  if (Array.isArray(data)) return data;
  if (data) return [data];
  return [];
}

/**
 * POST multipart FormData to a BFF upload route.
 * Uses native fetch so the browser sets the multipart boundary automatically
 * (axios would send the instance's application/json content type instead).
 */
async function postUploadForm(path: string, form: FormData): Promise<unknown> {
  let payload: unknown = {};
  let status = 0;
  try {
    const res = await fetch(`/api${path}`, { method: "POST", body: form });
    status = res.status;
    payload = await res.json().catch(() => ({}));
  } catch (error) {
    throw toApiError(error, "Upload failed");
  }
  const body = payload as { success?: boolean; message?: string };
  if (status < 200 || status >= 300 || !body.success) {
    throw new ApiError(status || 400, "UPLOAD_FAILED", body.message || "Upload failed", payload);
  }
  return payload;
}

export async function uploadImage(file: File, folder: UploadFolder): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  const payload = await postUploadForm("/uploads/image", form);
  const [uploaded] = toUploadedFiles(payload);
  if (!uploaded) throw new ApiError(400, "UPLOAD_FAILED", "Upload returned no file");
  return uploaded;
}

export async function uploadImages(files: File[], folder: UploadFolder): Promise<UploadedFile[]> {
  const form = new FormData();
  for (const file of files) form.append("files", file);
  form.append("folder", folder);
  return toUploadedFiles(await postUploadForm("/uploads/images", form));
}

export type ExperienceLevel = "beginner" | "intermediate" | "expert";

export interface HandymanCategoryInput {
  /** ServiceCategory ObjectId */
  type: string;
  experienceLevel: ExperienceLevel;
  subCategory?: string[];
}

export interface CreateHandymanInput {
  categoryId: HandymanCategoryInput[];
  location?: {
    coordinates: [number, number];
    state?: string;
    lga?: string;
  };
  tags?: string[];
}

export async function createHandymanProfile(input: CreateHandymanInput): Promise<unknown> {
  try {
    const { data } = await internalApi.post("/handymen", input);
    if (!data?.success) {
      throw new ApiError(400, "HANDYMAN_CREATE_FAILED", data?.message || "Profile creation failed");
    }
    return data.handyman ?? data;
  } catch (error) {
    throw toApiError(error, "Profile creation failed");
  }
}

export interface UpdateMyUserInput {
  fullname?: string;
  role?: 'client' | 'handyman';
  phone?: string;
  bio?: string;
  address?: string;
  image?: { url: string; public_id: string };
  location?: { state?: string; lga?: string };
}

export async function updateMyUser(input: UpdateMyUserInput): Promise<unknown> {
  try {
    const { data } = await internalApi.put("/users/me", input);
    if (data && data.success === false) {
      throw new ApiError(400, "USER_UPDATE_FAILED", data.message || "Update failed");
    }
    return data?.user ?? data;
  } catch (error) {
    throw toApiError(error, "Update failed");
  }
}

export interface ServiceCategorySummary {
  _id: string;
  displayName: string;
  image?: { url?: string };
}

export async function getCategorySummaries(): Promise<ServiceCategorySummary[]> {
  try {
    const { data } = await internalApi.get("/categories", {
      params: { isActive: true },
    });
    // Backend envelopes vary by endpoint (`categories` | `items` | `data`).
    const list = Array.isArray(data)
      ? data
      : (data?.categories ?? data?.items ?? data?.data ?? []);
    return (list as ServiceCategorySummary[]).filter((c) => c && c._id);
  } catch (error) {
    throw toApiError(error, "Failed to load categories");
  }
}

export type PreferredLanguage = "hausa" | "igbo" | "yoruba" | "fulani" | "english";
export type UrgencyTendency = "PLANNED" | "EMERGENCY" | "FLEXIBLE";

export interface CreateHirerInput {
  organizationName?: string;
  preferences?: {
    preferredLanguage?: PreferredLanguage;
    urgencyTendency?: UrgencyTendency;
  };
}

export async function createHirerProfile(input: CreateHirerInput): Promise<unknown> {
  try {
    const { data } = await internalApi.post("/hirers", input);
    if (!data?.success) {
      throw new ApiError(400, "HIRER_CREATE_FAILED", data?.message || "Profile creation failed");
    }
    return data.hirer ?? data;
  } catch (error) {
    throw toApiError(error, "Profile creation failed");
  }
}

export type JobUrgency = "URGENT" | "NORMAL" | "FLEXIBLE";

export interface CreateJobInput {
  title: string;
  description: string;
  /** ServiceCategory ObjectId */
  category: string;
  budget: { min: number; max: number };
  urgency?: JobUrgency;
  image?: { url: string; public_id: string }[];
  location: { coordinates: [number, number] };
}

export async function createJob(input: CreateJobInput): Promise<{ id?: string; raw: unknown }> {
  try {
    const { data } = await internalApi.post("/jobs", input);
    if (!data?.success) {
      throw new ApiError(400, "JOB_CREATE_FAILED", data?.message || "Job posting failed");
    }
    const job = data.job as { _id?: string } | undefined;
    return { id: job?._id, raw: data };
  } catch (error) {
    throw toApiError(error, "Job posting failed");
  }
}

export type PricingModel = "fixed" | "hourly" | "contract";

export interface CreateServiceInput {
  category: string;
  subCategory: string;
  description: string;
  price: number;
  pricingModel: PricingModel;
  date: string;
  schedule?: { estimatedTime?: string; estimatedDuration?: string };
  handyman_id?: string;
  image?: { url: string; public_id: string }[];
  materials_included?: boolean;
  tags?: string[];
}

export async function createService(input: CreateServiceInput): Promise<{ id?: string; raw: unknown }> {
  try {
    const { data } = await internalApi.post("/services", input);
    if (!data?.success) {
      throw new ApiError(400, "SERVICE_CREATE_FAILED", data?.message || "Service creation failed");
    }
    const service = data.service as { _id?: string } | undefined;
    return { id: service?._id, raw: data };
  } catch (error) {
    throw toApiError(error, "Service creation failed");
  }
}

export interface UpdateHandymanInput {
  availability?: { status?: "available" | "unavailable" };
  location?: { coordinates?: [number, number]; state?: string; lga?: string };
  tags?: string[];
  categoryId?: HandymanCategoryInput[];
}

export async function updateHandymanProfile(input: UpdateHandymanInput): Promise<unknown> {
  try {
    const { data } = await internalApi.patch("/handymen/me", input);
    if (data && data.success === false) {
      throw new ApiError(400, "HANDYMAN_UPDATE_FAILED", data.message || "Update failed");
    }
    return data?.handyman ?? data;
  } catch (error) {
    throw toApiError(error, "Update failed");
  }
}

export type BookingStatusUpdate = "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export async function updateBookingStatus(
  id: string,
  input: { status: BookingStatusUpdate; cancellationReason?: string },
): Promise<unknown> {
  try {
    const { data } = await internalApi.patch(`/bookings/${encodeURIComponent(id)}/status`, input);
    if (!data?.success) {
      throw new ApiError(400, "BOOKING_UPDATE_FAILED", data?.message || "Update failed");
    }
    return data.booking ?? data;
  } catch (error) {
    throw toApiError(error, "Update failed");
  }
}

export type DisputeReason =
  | "POOR_QUALITY"
  | "DELAYED_WORK"
  | "UNFINISHED_TASK"
  | "PAYMENT_ISSUE"
  | "UNPROFESSIONAL_BEHAVIOR";

export interface CreateDisputeInput {
  serviceId: string;
  reason: DisputeReason;
  description: string;
  evidence?: { public_id: string; url: string; type: "IMAGE" | "VIDEO" | "DOCUMENT" }[];
}

export async function createDispute(input: CreateDisputeInput): Promise<{ id?: string; raw: unknown }> {
  try {
    const { data } = await internalApi.post("/disputes", input);
    if (!data?.success) {
      throw new ApiError(400, "DISPUTE_CREATE_FAILED", data?.message || "Dispute creation failed");
    }
    const dispute = data.dispute as { _id?: string } | undefined;
    return { id: dispute?._id, raw: data };
  } catch (error) {
    throw toApiError(error, "Dispute creation failed");
  }
}

export async function resetPassword(password: string): Promise<void> {
  try {
    const { data } = await internalApi.put("/auth/password-reset", { password });
    if (data && data.success === false) {
      throw new ApiError(400, "PASSWORD_RESET_FAILED", data.message || "Password change failed");
    }
  } catch (error) {
    throw toApiError(error, "Password change failed");
  }
}

export interface AdminCategoryInput {
  code: string;
  displayName: string;
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface AdminSubcategoryInput {
  displayName: string;
  profession: string;
  description?: string;
  isActive?: boolean;
}

export interface AdminTagInput {
  displayName: string;
  category: string;
  color?: string;
  icon?: string;
  isActive?: boolean;
}

async function adminCreate(path: string, body: unknown, label: string): Promise<unknown> {
  try {
    const { data } = await internalApi.post(path, body);
    if (data && data.success === false) {
      throw new ApiError(400, "ADMIN_CREATE_FAILED", data.message || `${label} creation failed`);
    }
    return data;
  } catch (error) {
    throw toApiError(error, `${label} creation failed`);
  }
}

async function adminUpdate(path: string, id: string, body: unknown, label: string): Promise<unknown> {
  try {
    const { data } = await internalApi.put(`${path}/${encodeURIComponent(id)}`, body);
    if (data && data.success === false) {
      throw new ApiError(400, "ADMIN_UPDATE_FAILED", data.message || `${label} update failed`);
    }
    return data;
  } catch (error) {
    throw toApiError(error, `${label} update failed`);
  }
}

async function adminRemove(path: string, id: string, label: string): Promise<void> {
  try {
    const { data } = await internalApi.delete(`${path}/${encodeURIComponent(id)}`);
    if (data && data.success === false) {
      throw new ApiError(400, "ADMIN_DELETE_FAILED", data.message || `${label} deletion failed`);
    }
  } catch (error) {
    throw toApiError(error, `${label} deletion failed`);
  }
}

export const createAdminCategory = (input: AdminCategoryInput) =>
  adminCreate("/admin/categories", input, "Category");
export const updateAdminCategory = (id: string, input: Partial<AdminCategoryInput>) =>
  adminUpdate("/admin/categories", id, input, "Category");
export const deleteAdminCategory = (id: string) =>
  adminRemove("/admin/categories", id, "Category");

export const createAdminSubcategory = (input: AdminSubcategoryInput) =>
  adminCreate("/admin/subcategories", input, "Subcategory");
export const updateAdminSubcategory = (id: string, input: Partial<AdminSubcategoryInput>) =>
  adminUpdate("/admin/subcategories", id, input, "Subcategory");
export const deleteAdminSubcategory = (id: string) =>
  adminRemove("/admin/subcategories", id, "Subcategory");

export const createAdminTag = (input: AdminTagInput) =>
  adminCreate("/admin/tags", input, "Tag");
export const updateAdminTag = (id: string, input: Partial<AdminTagInput>) =>
  adminUpdate("/admin/tags", id, input, "Tag");
export const deleteAdminTag = (id: string) =>
  adminRemove("/admin/tags", id, "Tag");

export async function updateService(id: string, input: Partial<CreateServiceInput>): Promise<unknown> {
  try {
    const { data } = await internalApi.put(`/services/${encodeURIComponent(id)}`, input);
    if (!data?.success) {
      throw new ApiError(400, "SERVICE_UPDATE_FAILED", data?.message || "Service update failed");
    }
    return data.service ?? data;
  } catch (error) {
    throw toApiError(error, "Service update failed");
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const { data } = await internalApi.delete(`/services/${encodeURIComponent(id)}`);
    if (data && data.success === false) {
      throw new ApiError(400, "SERVICE_DELETE_FAILED", data.message || "Service deletion failed");
    }
  } catch (error) {
    throw toApiError(error, "Service deletion failed");
  }
}

export async function updateJob(id: string, input: Partial<CreateJobInput>): Promise<unknown> {
  try {
    const { data } = await internalApi.patch(`/jobs/${encodeURIComponent(id)}`, input);
    if (!data?.success) {
      throw new ApiError(400, "JOB_UPDATE_FAILED", data?.message || "Job update failed");
    }
    return data.job ?? data;
  } catch (error) {
    throw toApiError(error, "Job update failed");
  }
}

export async function deleteJob(id: string): Promise<void> {
  try {
    const { data } = await internalApi.delete(`/jobs/${encodeURIComponent(id)}`);
    if (data && data.success === false) {
      throw new ApiError(400, "JOB_DELETE_FAILED", data.message || "Job cancellation failed");
    }
  } catch (error) {
    throw toApiError(error, "Job cancellation failed");
  }
}

export interface AcceptJobBidInput {
  jobId: string;
  handymanId: string;
  scheduledDate?: string;
  totalAmount?: number;
}

export async function acceptJobBid(input: AcceptJobBidInput): Promise<{ id?: string; raw: unknown }> {
  try {
    const { data } = await internalApi.post("/bookings/job", input);
    if (!data?.success) {
      throw new ApiError(400, "BID_ACCEPT_FAILED", data?.message || "Failed to accept bid");
    }
    const booking = data.booking as { _id?: string } | undefined;
    return { id: booking?._id, raw: data };
  } catch (error) {
    throw toApiError(error, "Failed to accept bid");
  }
}
