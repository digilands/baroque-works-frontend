"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceBooking,
  type CreateServiceBookingInput,
  type CreateServiceBookingResult,
} from "@/lib/api";

/** Create a direct-service booking. Invalidates the bookings cache. */
export function useCreateServiceBooking() {
  const queryClient = useQueryClient();
  return useMutation<CreateServiceBookingResult, Error, CreateServiceBookingInput>({
    mutationFn: createServiceBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}
