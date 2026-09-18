import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/** GET /api/handymen/[id] — handyman profile detail (public). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyGet(request, `/handymen/${id}`);
}
