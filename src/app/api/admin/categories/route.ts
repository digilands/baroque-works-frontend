import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/** GET /api/admin/categories — list (proxies public read). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/categories");
}

/** POST /api/admin/categories — create (admin only). */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/admin/categories");
}
