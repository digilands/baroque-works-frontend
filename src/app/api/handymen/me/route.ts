import type { NextRequest } from "next/server";
import { proxyPatch } from "@/lib/api-proxy";

/** PATCH /api/handymen/me — update the authenticated user's handyman profile. */
export async function PATCH(request: NextRequest) {
  return proxyPatch(request, "/handymen");
}
