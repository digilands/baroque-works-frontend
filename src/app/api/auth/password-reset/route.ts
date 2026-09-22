import type { NextRequest } from "next/server";
import { proxyPut } from "@/lib/api-proxy";

/**
 * PUT /api/auth/password-reset — change the authenticated user's password.
 * Body: { password }.
 */
export async function PUT(request: NextRequest) {
  return proxyPut(request, "/auth/password-reset");
}
