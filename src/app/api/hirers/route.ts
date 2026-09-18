import type { NextRequest } from "next/server";
import { proxyPost } from "@/lib/api-proxy";

/**
 * POST /api/hirers — create the authenticated user's hirer profile
 * (client onboarding). Body: CreateHirerDto.
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/hirers");
}
