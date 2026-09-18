import { NextResponse, type NextRequest } from "next/server";
import { backendGet, backendPatch } from "@/lib/server/backend";
import { ApiError } from "@/lib/api-errors";

/**
 * PUT /api/users/me — update the authenticated user's own record.
 * Resolves the user id from the session, then proxies to PUT /users/{id}.
 * Used by onboarding for phone, avatar, bio, and address.
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await backendGet<{ success: boolean; user: { _id?: string } }>(
      "/auth/me",
    );
    const userId = session.user?._id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Session user not found" },
        { status: 401 },
      );
    }
    const body = await request.json();
    const updated = await backendPatch(
      `/users/${encodeURIComponent(userId)}`,
      body,
    );
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status || 500 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}
