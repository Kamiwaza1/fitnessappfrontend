import { NextResponse } from 'next/server';
import { isTokenExpired } from './src/lib/authToken';

function clearAuthCookies(response) {
  response.cookies.delete('authToken');
  response.cookies.delete('token');
  response.cookies.delete('jwt');
  return response;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const authToken =
    request.cookies.get('authToken')?.value ||
    request.cookies.get('token')?.value ||
    request.cookies.get('jwt')?.value;

  const hasToken = Boolean(authToken);
  const hasValidToken = hasToken && !isTokenExpired(authToken);

  // Allow unauthenticated access to /login and /register
  if (pathname === '/login' || pathname === '/register') {
    // If already authenticated, redirect to dashboard
    if (hasValidToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (hasToken) {
      return clearAuthCookies(NextResponse.next());
    }
    return NextResponse.next();
  }

  // Protect all non-public routes
  if (!hasValidToken) {
    return clearAuthCookies(NextResponse.redirect(new URL('/login', request.url)));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
