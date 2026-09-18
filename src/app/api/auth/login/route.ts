import { NextResponse } from 'next/server';
import { backendApi } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Call Backend API
    const response = await backendApi.post('/auth/login', { email, password });
    
    // Extract token and user from response
    // Inspect the actual response structure from backend docs!
    // Docs say: 200 OK -> "Login successful" (Wait, docs are vague on response body)
    // Assuming standard JWT response structure: { token: string, user: ... } based on `/auth/google/mobile` example
    
    const { token, user, refreshToken } = response.data;

    if (!token) {
      return NextResponse.json({ message: 'Authentication failed' }, { status: 401 });
    }

    // Set Cookies
    const cookieStore = await cookies();
    
    // Access Token (HTTPOnly)
    cookieStore.set('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days (adjust based on token lifetime)
      path: '/',
    });

    // Refresh Token (if available)
    if (refreshToken) {
        cookieStore.set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: '/',
        });
    }

    return NextResponse.json({ success: true, user });

  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error('Login error:', err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || 'Login failed' },
      { status: err.response?.status || 500 }
    );
  }
}
