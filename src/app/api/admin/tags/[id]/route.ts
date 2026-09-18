import type { NextRequest } from "next/server";
import { proxyDelete, proxyPut } from "@/lib/api-proxy";

/** PUT /api/admin/tags/[id] — update (admin only). */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyPut(request, `/admin/tags/${id}`);
}

/** DELETE /api/admin/tags/[id] — delete (admin only). */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyDelete(request, `/admin/tags/${id}`);
}
