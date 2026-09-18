import type { NextRequest } from "next/server";
import { proxyGet, proxyPost } from "@/lib/api-proxy";

/** GET /api/admin/tags — list (supports ?category). */
export async function GET(request: NextRequest) {
  return proxyGet(request, "/categories/tags");
}

/** POST /api/admin/tags — create (admin only). */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/admin/tags");
}
