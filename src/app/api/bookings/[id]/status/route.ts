import type { NextRequest } from "next/server";
import { proxyPatch } from "@/lib/api-proxy";

/**
 * PATCH /api/bookings/[id]/status — update booking status.
 * Body: { status, cancellationReason?, completedDate? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyPatch(request, `/bookings/${id}/status`);
}
