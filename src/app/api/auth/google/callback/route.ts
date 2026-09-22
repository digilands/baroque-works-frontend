import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { backendApi } from '@/lib/auth';

/**
 * GET /api/auth/google/callback — handles the OAuth redirect from Google
 * (via the backend). Sets session cookies, then routes by role AND profile
 * completeness so first-time Google users land in onboarding instead of
 * skipping it.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('accessToken') ?? searchParams.get('token');
  const refreshToken = searchParams.get('refreshToken');
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!token && !code) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
  }

  // The backend's documented web flow returns an authorization code to its
  // callback and sets the session cookies on its response. Forward those
  // cookies to this origin so the BFF can authenticate subsequent requests.
  if (!token && code) {
    try {
      const backendResponse = await backendApi.get('/auth/google/callback', {
        params: { code, ...(state ? { state } : {}) },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      });
      const redirect = NextResponse.redirect(new URL('/dashboard', request.url));
      const setCookies = backendResponse.headers['set-cookie'];
      for (const cookie of setCookies ?? []) {
        redirect.headers.append('set-cookie', cookie.replace(/;\s*Domain=[^;]+/i, ''));
      }
      return redirect;
    } catch {
      return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
  }

  const cookieStore = await cookies();

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
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
    });
  }

  // Resolve destination using the backend API directly with the fresh token.
  // Do NOT use server-only helpers (getMyHandymanProfile / getMyHirerProfile)
  // here — those rely on cookies which aren't set until the browser follows
  // the redirect, and route handlers can't forward them in the same response.
  try {
    const me = await backendApi.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = me.data?.user ?? me.data?.data?.user ?? me.data?.data ?? me.data ?? null;

    if (!user) {
      return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
    }

    // No role → fresh signup / OAuth first-timer → role selection
    if (!user.role) {
      return NextResponse.redirect(new URL('/auth/role-selection', request.url));
    }

    // Handyman without a profile → onboarding
    if (user.role === 'handyman') {
      const profile = await backendApi
        .get('/handymen/me/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((r) => r.data?.handyman ?? r.data?.data?.handyman ?? null)
        .catch(() => null);
      return NextResponse.redirect(
        new URL(profile ? '/dashboard/jobs' : '/auth/serviceselection', request.url),
      );
    }

    // Client without hirer profile → client onboarding
    const hirer = await backendApi
      .get('/hirers/me/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => r.data?.hirer ?? r.data?.data?.hirer ?? null)
      .catch(() => null);
    return NextResponse.redirect(
      new URL(hirer?.profile_completed ? '/dashboard' : '/auth/onboarding/client', request.url),
    );
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=oauth_failed', request.url));
  }
}
