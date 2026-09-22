import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/** GET /api/categories/tags — proxy (supports ?category&isActive). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/categories/tags");
}
