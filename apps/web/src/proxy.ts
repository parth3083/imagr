import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ONLY = new Set(['/sign-in', '/sign-up', '/forgot-password', '/reset-password']);
const PUBLIC_ALL = new Set(['/', '/sign-in', '/sign-up', '/forgot-password', '/reset-password']);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken =
    request.cookies.get('better-auth.session_token') ??
    request.cookies.get('__Secure-better-auth.session_token');
  const isAuthenticated = !!sessionToken?.value;

  if (isAuthenticated && PUBLIC_ONLY.has(pathname)) {
    return NextResponse.redirect(new URL('/dashboard/studio', request.url));
  }

  if (!PUBLIC_ALL.has(pathname) && !isAuthenticated) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
