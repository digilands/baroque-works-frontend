import type { NextRequest } from "next/server";
import { proxyMultipartPost } from "@/lib/api-proxy";

/**
 * POST /api/uploads/images — upload up to 10 images at once.
 * multipart/form-data: files (binary[]), folder?.
 */
export async function POST(request: NextRequest) {
  return proxyMultipartPost(request, "/uploads/images");
}
