import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/**
 * GET /api/jobs — job listings with filters and geospatial search.
 * Forwards query params: category, urgency, status, minBudget, maxBudget,
 * latitude, longitude, radius, limit, cursor.
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/jobs");
}

/** POST /api/jobs — create a new job posting (hirer only). */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/jobs");
}
