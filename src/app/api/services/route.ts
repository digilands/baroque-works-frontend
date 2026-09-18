import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/**
 * GET /api/services — home feed for clients.
 * Forwards query params: page, cursor, limit, category, status,
 * pricingModel, minPrice, maxPrice, rating, handymanId,
 * latitude, longitude, radius.
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/services");
}

/** POST /api/services — create a new service (handyman only). */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/services");
}
