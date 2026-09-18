import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/**
 * GET /api/users — paginated user list (admin).
 * Forwards query params: nextCursor, limit, role.
 */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/users");
}
