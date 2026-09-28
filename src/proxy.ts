/**
 * src/proxy.ts  — Next.js 16 Route Guard (formerly middleware.ts)
 *
 * Protects every path under /admin/** using the existing jv_session JWT.
 * - Unauthenticated visitors → redirect to /admin/login
 * - Authenticated non-ADMIN users → redirect to / (home)
 * - ADMIN users → pass through
 *
 * The login page (/admin/login) and its API (/api/admin/login) are always
 * reachable so the sign-in form is never accidentally blocked.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'j-viloria-session-secret-key-32ch'
);

/** Paths inside /admin that must always be public (login UI + API). */
const PUBLIC_ADMIN_PATHS = ['/admin/login', '/api/admin/login'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login page and its API through unconditionally.
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Grab the session cookie.
  const sessionCookie = request.cookies.get('jv_session')?.value;

  if (!sessionCookie) {
    // No session at all → send to admin login.
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname); // remember where they came from
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(sessionCookie, SECRET, {
      algorithms: ['HS256'],
    });

    // Valid JWT but role is not ADMIN → kick to home.
    if ((payload as { role?: string }).role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // All good — let the request through.
    return NextResponse.next();
  } catch {
    // Expired / tampered token → treat as unauthenticated.
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/** Only run this proxy on /admin and /api/admin paths. */
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
