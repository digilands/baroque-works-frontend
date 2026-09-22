import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/**
 * GET /api/bookings — bookings for the authenticated user (hirer or handyman).
 * Forwards query params: status, bookingSource, paymentStatus,
 * hirerId, handymanId, limit, cursor.
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/bookings");
}

/**
 * POST /api/bookings/job — accept a handyman's bid on a job posting.
 * Body: { jobId, handymanId, scheduledDate?, totalAmount? }
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/bookings/job");
}
