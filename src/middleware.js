import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'vrindavan_divine_stay_super_secret_jwt_key_2026_change_in_prod'
);
const SESSION_COOKIE_NAME = 'vh_admin_session';

async function verifyEdgeToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Canonical www -> non-www 301 redirect in production
  if (host.startsWith('www.')) {
    const cleanHost = host.replace(/^www\./, '');
    const redirectUrl = new URL(request.url);
    redirectUrl.host = cleanHost;
    return NextResponse.redirect(redirectUrl, 301);
  }

  // 2. Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifyEdgeToken(token) : null;

    if (!session || session.role !== 'admin') {
      const loginUrl = new URL('/admin/login/', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  // 3. Ensure /admin/login also sends X-Robots-Tag: noindex
  if (pathname.startsWith('/admin/login')) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
