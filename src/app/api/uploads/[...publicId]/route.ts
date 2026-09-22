import type { NextRequest } from "next/server";
import { proxyDelete } from "@/lib/api-proxy";

/**
 * DELETE /api/uploads/[...publicId] — delete a file from Cloudinary.
 * Catch-all because public IDs contain slashes (e.g. user-profiles/abc123).
 * Optional JSON body: { resourceType?: "image" | "video" }.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string[] }> },
) {
  const { publicId } = await params;
  const encoded = publicId.map(encodeURIComponent).join("/");
  return proxyDelete(request, `/uploads/${encoded}`);
}
