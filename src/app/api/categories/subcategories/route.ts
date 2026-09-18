import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/** GET /api/categories/subcategories — proxy (supports ?categoryId&isActive). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/categories/subcategories");
}
