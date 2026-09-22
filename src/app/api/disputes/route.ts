import type { NextRequest } from "next/server";
import { proxyPost } from "@/lib/api-proxy";

/**
 * POST /api/disputes — raise a dispute about a service.
 * Body: { serviceId, reason, description, evidence? }.
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/disputes");
}
