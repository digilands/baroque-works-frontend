import type { NextRequest } from "next/server";
import { proxyGet } from "@/lib/api-proxy";

/** GET /api/bookings/[id] — booking detail. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyGet(request, `/bookings/${id}`);
}
