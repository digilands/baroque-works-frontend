import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendApi } from "@/lib/auth";

/**
 * POST /api/auth/refresh — rotate the session using the HTTP-only
 * refreshToken cookie. Called automatically by the client interceptor
 * on 401 responses.
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "No refresh token" },
        { status: 401 },
      );
    }

    const response = await backendApi.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (accessToken) {
      cookieStore.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    if (newRefreshToken) {
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number } };
    return NextResponse.json(
      { success: false, message: err.response?.data?.message ?? "Session expired" },
      { status: 401 },
    );
  }
}
