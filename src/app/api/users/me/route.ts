import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { backendGet, backendPut } from "@/lib/server/backend";
import { ApiError } from "@/lib/api-errors";

interface UpdatedUserResponse {
  success?: boolean;
  user?: unknown;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
}

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
    const updated = await backendPut<UpdatedUserResponse>(
      `/users/${encodeURIComponent(userId)}`,
      body,
    );

    // Role updates rotate the JWT because the backend authorization middleware
    // reads role from the access-token claims.
    if (updated.accessToken || updated.refreshToken) {
      const cookieStore = await cookies();
      if (updated.accessToken) {
        cookieStore.set("accessToken", updated.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60,
          path: "/",
        });
      }
      if (updated.refreshToken) {
        cookieStore.set("refreshToken", updated.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        });
      }
    }

    // Do not expose refreshed tokens to browser JavaScript.
    const safeResponse = { ...updated };
    delete safeResponse.accessToken;
    delete safeResponse.refreshToken;
    return NextResponse.json(safeResponse);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: error.code,
          ...(error.details !== undefined ? { details: error.details } : {}),
        },
        { status: error.status || 500 },
      );
    }
    return NextResponse.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}
