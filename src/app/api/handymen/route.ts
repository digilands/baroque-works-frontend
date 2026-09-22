import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/**
 * GET /api/handymen — geospatial search with filters.
 * Forwards query params: cursor, limit, categoryId, experienceLevel,
 * rating, latitude, longitude, radius.
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/handymen");
}

/** POST /api/handymen — create the authenticated user's handyman profile. */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/handymen");
}
