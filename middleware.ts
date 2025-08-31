import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Handle CSS files with proper MIME type
  if (request.nextUrl.pathname.includes('/_next/static/css/')) {
    const response = NextResponse.next();
    response.headers.set('Content-Type', 'text/css');
    return response;
  }

  // Skip middleware for login pages
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = request.cookies.get('session');

  // Return to login if there's no session
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // For protected routes, validate session through an API endpoint
  try {
    const response = await fetch(new URL('/api/auth/session/validate', request.url), {
      headers: {
        Cookie: `session=${session.value}`,
      },
    });

    if (!response.ok) {
      throw new Error('Invalid session');
    }

    const data = await response.json();
    const isAdmin = data.isAdmin === true;

    // Check admin routes - require admin privileges
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }

    // Dashboard routes just need a valid session (admin or regular user)
    // No additional checks needed since we already validated the session

    return NextResponse.next();
  } catch (error) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/_next/static/css/:path*',
  ],
}; 