import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

const AUTH_PAGES = ['/login', '/register'];

/**
 * Each role has a "home" — where they get bounced to if they wander into a
 * route that doesn't belong to their role, or land on /login or /register
 * while already signed in.
 */
function homeFor(role) {
  if (role === 'admin')     return '/admin';
  if (role === 'organiser') return '/organiser/events';
  return '/attendee/events';
}

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('session')?.value;
  const isAuthPage = AUTH_PAGES.includes(pathname);

  // No cookie at all — allow auth pages through, send everyone else to /login.
  if (!token) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', req.url));
  }

  let role;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    role = payload.role;
  } catch {
    // Bad/expired token — same fall-through as no cookie.
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Signed-in users have no business on /login or /register.
  if (isAuthPage) {
    return NextResponse.redirect(new URL(homeFor(role), req.url));
  }

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
}

// Only intercept UI routes that need protection. API routes do their own auth check.
export const config = {
  matcher: ['/attendee/:path*', '/organiser/:path*', '/admin/:path*', '/login', '/register'],
};
