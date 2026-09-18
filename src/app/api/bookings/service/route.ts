import type { NextRequest } from "next/server";
import { proxyPost } from "@/lib/api-proxy";

/**
 * POST /api/bookings/service — book a handyman service directly.
 * Body: { serviceId, handymanId, scheduledDate?, totalAmount? }
 * Backend returns the booking plus a Monnify payment reference.
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/bookings/service");
}
