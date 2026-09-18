import type { NextRequest } from "next/server";
import { proxyDelete, proxyPut } from "@/lib/api-proxy";

/** PUT /api/admin/categories/[id] — update (admin only). */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyPut(request, `/admin/categories/${id}`);
}

/** DELETE /api/admin/categories/[id] — delete (admin only). */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyDelete(request, `/admin/categories/${id}`);
}
