import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { backendApi } from '@/lib/auth';

/**
 * POST /api/auth/signup — register a new user.
 *
 * The backend returns tokens in the JSON body but does NOT set cookies,
 * so this route sets the session cookies itself (mirrors the login route).
 * A fresh signup lands authenticated and flows straight into
 * /auth/role-selection instead of bouncing through login.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Call Backend API
    const response = await backendApi.post('/auth/signup', body);
    const { accessToken, refreshToken, user } = response.data ?? {};

    if (!response.data?.success) {
      return NextResponse.json(
        { message: response.data?.message || 'Signup failed' },
        { status: response.status || 400 },
      );
    }

    // Set Cookies (backend does not set them on signup)
    if (accessToken || refreshToken) {
      const cookieStore = await cookies();

      if (accessToken) {
        cookieStore.set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
      }

      if (refreshToken) {
        cookieStore.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });
      }
    }

    return NextResponse.json({ success: true, data: response.data, user });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error('Signup error:', err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || 'Signup failed' },
      { status: err.response?.status || 500 }
    );
  }
}
