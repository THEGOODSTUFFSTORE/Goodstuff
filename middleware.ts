import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';

// Paths that require authentication
const protectedPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath) {
    // Get the Firebase auth session cookie
    const session = request.cookies.get('session');

    // If there's no session, redirect to login
    if (!session) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Configure the paths that middleware should be run on
export const config = {
  matcher: [
    // Match all request paths except for /admin/login
    '/((?!admin/login)admin.*)'
  ],
}; 