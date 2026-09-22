import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/** GET /api/categories — proxy to GET /categories (supports ?isActive). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/categories");
}
