import type { NextRequest } from "next/server";
import { proxyDelete, proxyGet, proxyPut } from "@/lib/api-proxy";

/** GET /api/services/[id] — service detail. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyGet(request, `/services/${id}`);
}

/** PUT /api/services/[id] — update a service (owner only). */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyPut(request, `/services/${id}`);
}

/** DELETE /api/services/[id] — delete a service (owner only). */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // Service deletion needs no body; proxyDelete tolerates an empty one.
  return proxyDelete(request, `/services/${id}`);
}
