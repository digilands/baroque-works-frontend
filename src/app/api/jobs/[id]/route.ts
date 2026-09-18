import type { NextRequest } from "next/server";
import { proxyDelete, proxyGet, proxyPatch } from "@/lib/api-proxy";

/** GET /api/jobs/[id] — job detail. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyGet(request, `/jobs/${id}`);
}

/** PATCH /api/jobs/[id] — update a job (owner only). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyPatch(request, `/jobs/${id}`);
}

/** DELETE /api/jobs/[id] — cancel a job (owner only). */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyDelete(request, `/jobs/${id}`);
}
