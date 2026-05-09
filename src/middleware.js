import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);

    // /organiser/* requires organiser or admin
    if (
      pathname.startsWith('/organiser') &&
      payload.role !== 'organiser' &&
      payload.role !== 'admin'
    ) {
      return NextResponse.redirect(new URL('/', req.url));
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
