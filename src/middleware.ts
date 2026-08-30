import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Protected Routes
  // if (request.nextUrl.pathname.startsWith('/dashboard')) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/auth/login', request.url));
  //   }
  // }

  // Redirect to dashboard if already logged in and visiting login/signup
  if (isAuthPage && token) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
