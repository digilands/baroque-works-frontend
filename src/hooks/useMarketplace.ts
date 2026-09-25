"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptJobBid,
  createDispute,
  createJob,
  createService,
  deleteJob,
  deleteService,
  getCategorySummaries,
  removeServiceImage,
  resetPassword,
  updateBookingStatus,
  updateHandymanProfile,
  updateJob,
  updateService,
  type AcceptJobBidInput,
  type BookingStatusUpdate,
  type CreateDisputeInput,
  type CreateJobInput,
  type CreateServiceInput,
  type ServiceCategorySummary,
  type UpdateHandymanInput,
} from "@/lib/api";
import type { ProfessionSubCategory } from "@/lib/server/queries";
import { internalApi } from "@/lib/auth";

/** Active categories (shared browser for search + creation forms). */
export function useCategories() {
  return useQuery<ServiceCategorySummary[]>({
    queryKey: ["categories"],
    queryFn: getCategorySummaries,
    staleTime: 10 * 60 * 1000,
  });
}

/** Subcategories of one category (dependent select in service creation). */
export function useSubcategories(categoryId?: string) {
  return useQuery<ProfessionSubCategory[]>({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      const { data } = await internalApi.get("/categories/subcategories", {
        params: { categoryId, isActive: true },
      });
      // Backend envelopes vary by endpoint (`subcategories` | `items` | `data`).
      const list = Array.isArray(data)
        ? data
        : (data?.subcategories ?? data?.items ?? data?.data ?? []);
      return list as ProfessionSubCategory[];
    },
    enabled: Boolean(categoryId),
    staleTime: 10 * 60 * 1000,
  });
}

/** Post a new job (client only). */
export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation<{ id?: string; raw: unknown }, Error, CreateJobInput>({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/** Create a new service (handyman only). */
export function useCreateService() {
  return useMutation<{ id?: string; raw: unknown }, Error, CreateServiceInput>({
    mutationFn: createService,
  });
}

/** Update the handyman profile (availability, location, tags). */
export function useUpdateHandyman() {
  return useMutation<unknown, Error, UpdateHandymanInput>({
    mutationFn: updateHandymanProfile,
  });
}

/** Transition a booking (cancel / complete). Refreshes bookings + jobs. */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation<
    unknown,
    Error,
    { id: string; status: BookingStatusUpdate; cancellationReason?: string }
  >({
    mutationFn: ({ id, status, cancellationReason }) =>
      updateBookingStatus(id, { status, cancellationReason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/** Raise a dispute about a service. */
export function useCreateDispute() {
  return useMutation<{ id?: string; raw: unknown }, Error, CreateDisputeInput>({
    mutationFn: createDispute,
  });
}

/** Update an existing service (owner only). */
export function useUpdateService() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { id: string; input: Partial<CreateServiceInput> }>({
    mutationFn: ({ id, input }) => updateService(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

/** Remove one gallery image from a service (owner only). */
export function useRemoveServiceImage() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { serviceId: string; publicId: string }>({
    mutationFn: ({ serviceId, publicId }) => removeServiceImage(serviceId, publicId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

/** Delete a service (owner only). */
export function useDeleteService() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

/** Change the authenticated user's password. */
export function useResetPassword() {
  return useMutation<void, Error, string>({
    mutationFn: resetPassword,
  });
}

/** Update a job posting (owner only). */
export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation<unknown, Error, { id: string; input: Partial<CreateJobInput> }>({
    mutationFn: ({ id, input }) => updateJob(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/** Cancel a job posting (owner only). */
export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}

/** Accept a handyman for a job (hirer only) → creates a booking. */
export function useAcceptJobBid() {
  const queryClient = useQueryClient();
  return useMutation<{ id?: string; raw: unknown }, Error, AcceptJobBidInput>({
    mutationFn: acceptJobBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
