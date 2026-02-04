import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken'); // If backend sends it

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
  }

  const cookieStore = await cookies();

  // Set Cookies
  cookieStore.set('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  if (refreshToken) {
    cookieStore.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
    });
  }

  // Redirect to Dashboard
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
