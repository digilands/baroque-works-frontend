import type { NextRequest } from "next/server";
import { proxyMultipartPost } from "@/lib/api-proxy";

/**
 * POST /api/uploads/image — upload a single image.
 * multipart/form-data: file (binary), folder? (e.g. user-profiles,
 * user-services, user-jobs, service-categories).
 */
export async function POST(request: NextRequest) {
  return proxyMultipartPost(request, "/uploads/image");
}
