import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/** GET /api/admin/subcategories — list (supports ?categoryId). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/categories/subcategories");
}

/** POST /api/admin/subcategories — create (admin only). */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/admin/subcategories");
}
