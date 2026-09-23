import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/** GET /api/handymen/me/profile — own handyman profile (availability seed). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/handymen/me/profile");
}
