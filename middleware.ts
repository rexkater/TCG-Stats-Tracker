import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user has session cookie
  const sessionCookie = request.cookies.get('authjs.session-token') ||
                        request.cookies.get('__Secure-authjs.session-token');

  const isLoggedIn = !!sessionCookie;

  // Protected routes that require authentication
  const isProtectedRoute = pathname.startsWith('/projects') ||
                          pathname.startsWith('/api/projects') ||
                          pathname.startsWith('/api/entries');

  // If trying to access protected route without auth, redirect to signin
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/projects/:path*',
    '/api/projects/:path*',
    '/api/entries/:path*',
  ],
};

