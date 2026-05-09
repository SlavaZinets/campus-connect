import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

/**
 * Each role has a "home" — where they get bounced to if they wander into a
 * route that doesn't belong to their role.
 */
function homeFor(role) {
  if (role === 'admin')     return '/';
  if (role === 'organiser') return '/organiser/events';
  return '/attendee/events';
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role;

    // Admin can access every protected area.
    if (role === 'admin') return NextResponse.next();

    // /organiser/* — organisers only.
    if (pathname.startsWith('/organiser') && role !== 'organiser') {
      return NextResponse.redirect(new URL(homeFor(role), req.url));
    }

    // /attendee/* — attendees only.
    if (pathname.startsWith('/attendee') && role !== 'attendee') {
      return NextResponse.redirect(new URL(homeFor(role), req.url));
    }

    // /admin/* — admins only (already returned above; this catches everything else).
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL(homeFor(role), req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Only intercept UI routes that need protection. API routes do their own auth check.
export const config = {
  matcher: ['/attendee/:path*', '/organiser/:path*', '/admin/:path*'],
};
