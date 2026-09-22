"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminCategory,
  createAdminSubcategory,
  createAdminTag,
  deleteAdminCategory,
  deleteAdminSubcategory,
  deleteAdminTag,
  updateAdminCategory,
  updateAdminSubcategory,
  updateAdminTag,
  type AdminCategoryInput,
  type AdminSubcategoryInput,
  type AdminTagInput,
} from "@/lib/api";

function useAdminMutation<TInput, TResult = unknown>(
  fn: (input: TInput) => Promise<TResult>,
) {
  const queryClient = useQueryClient();
  return useMutation<TResult, Error, TInput>({
    mutationFn: fn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "catalog"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding", "categories"] });
    },
  });
}

export function useCreateAdminCategory() {
  return useAdminMutation(createAdminCategory);
}

export function useUpdateAdminCategory() {
  return useAdminMutation<{ id: string; input: Partial<AdminCategoryInput> }>(
    ({ id, input }) => updateAdminCategory(id, input),
  );
}

export function useDeleteAdminCategory() {
  return useAdminMutation<string, void>(deleteAdminCategory);
}

export function useCreateAdminSubcategory() {
  return useAdminMutation(createAdminSubcategory);
}

export function useUpdateAdminSubcategory() {
  return useAdminMutation<{ id: string; input: Partial<AdminSubcategoryInput> }>(
    ({ id, input }) => updateAdminSubcategory(id, input),
  );
}

export function useDeleteAdminSubcategory() {
  return useAdminMutation<string, void>(deleteAdminSubcategory);
}

export function useCreateAdminTag() {
  return useAdminMutation(createAdminTag);
}

export function useUpdateAdminTag() {
  return useAdminMutation<{ id: string; input: Partial<AdminTagInput> }>(
    ({ id, input }) => updateAdminTag(id, input),
  );
}

export function useDeleteAdminTag() {
  return useAdminMutation<string, void>(deleteAdminTag);
}
