import { NextResponse } from 'next/server';
import { backendApi } from '@/lib/auth';

/**
 * POST /api/auth/signup — register a new user.
 *
 * The backend sets accessToken/refreshToken cookies on 201 AND returns the
 * user body. axios drops Set-Cookie, so this route uses fetch to forward
 * them — a fresh signup lands authenticated and flows straight into
 * /auth/role-selection instead of bouncing through login.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const baseURL =
      backendApi.defaults.baseURL ??
      process.env.NEXT_PUBLIC_API_URL ??
      'http://localhost:3000';

    const backendRes = await fetch(`${baseURL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok || data?.success === false) {
      return NextResponse.json(
        { message: data?.message || 'Signup failed' },
        { status: backendRes.status || 500 },
      );
    }

    const response = NextResponse.json(
      { success: true, data },
      { status: backendRes.status },
    );

    // Forward any session cookies the backend set (fetch exposes them via
    // getSetCookie() on the server; fall back to a combined header).
    const forwarded: string[] =
      typeof backendRes.headers.getSetCookie === 'function'
        ? backendRes.headers.getSetCookie()
        : backendRes.headers.get('set-cookie')
          ? [backendRes.headers.get('set-cookie') as string]
          : [];
    for (const cookie of forwarded) {
      response.headers.append('Set-Cookie', cookie);
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    console.error('Signup error:', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
