import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Onboarding routes stay accessible to authenticated users who have not
// completed their profile. Profile-completion enforcement itself lives in the
// dashboard RSC (via GET /auth/me -> profile check); the proxy only
// gates on token presence to stay fast (no backend fetch per request).
const ONBOARDING_PATHS = [
  '/auth/role-selection',
  '/auth/onboarding',
  '/auth/profilesetup',
  '/auth/serviceselection',
  '/auth/additional-info',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAuthRoute = pathname.startsWith('/auth');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';

  // --- Admin routes use a separate login flow ---
  if (isAdminRoute) {
    if (!token && !isAdminLogin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Do NOT bounce cookie holders away from /admin/login: non-admin
    // sessions get sent here by /admin, and bouncing back would loop.
    return NextResponse.next();
  }

  // --- Protected dashboard routes: require a session ---
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- Auth routes ---
  if (isAuthRoute) {
    // Authenticated users completing onboarding may reach these pages
    const isOnboarding = ONBOARDING_PATHS.some((p) => pathname.startsWith(p));
    if (isOnboarding) {
      return NextResponse.next();
    }

    // Logged-in users should not see login/signup — EXCEPT when they arrive
    // with ?next= (recovery path after a failed /auth/me on /dashboard).
    // Unconditional bounce here is what created the
    // /dashboard -> /auth/login -> /dashboard redirect loop.
    const hasNext = request.nextUrl.searchParams.has('next');
    if (token && !hasNext) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/admin/:path*'],
};
