"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHandymanProfile,
  createHirerProfile,
  getCategorySummaries,
  updateMyUser,
  type CreateHandymanInput,
  type CreateHirerInput,
  type UpdateMyUserInput,
} from "@/lib/api";

/** Active service categories for the onboarding service picker. */
export function useOnboardingCategories() {
  return useQuery({
    queryKey: ["onboarding", "categories"],
    queryFn: getCategorySummaries,
    staleTime: 10 * 60 * 1000,
  });
}

/** Create the handyman profile (step 2 of handyman onboarding). */
export function useCreateHandyman() {
  return useMutation<unknown, Error, CreateHandymanInput>({
    mutationFn: createHandymanProfile,
  });
}

/** Update the session user's record (avatar, bio, address, phone). */
export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, UpdateMyUserInput>({
    mutationFn: updateMyUser,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

/** Create the hirer profile (client onboarding). */
export function useCreateHirer() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, CreateHirerInput>({
    mutationFn: createHirerProfile,
    onSuccess: () => {
      // The backend marks the hirer profile complete when this succeeds.
      // Refresh the session before any guarded dashboard/job navigation.
      void queryClient.invalidateQueries({ queryKey: ["user"] });
      void queryClient.invalidateQueries({ queryKey: ["hirer-profile"] });
    },
  });
}
