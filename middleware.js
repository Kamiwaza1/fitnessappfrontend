import { NextResponse } from 'next/server';
import { isTokenExpired } from '@/lib/authToken';

export function middleware(request) {
<<<<<<< Updated upstream
  // If the user is not on the /login or /register page, redirect to /login
  const { pathname } = request.nextUrl;
  if (pathname === '/' || pathname === '/page' || pathname === '/page.js' || pathname === '/page.jsx') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
=======
  const authToken =
    request.cookies.get('authToken')?.value ||
    request.cookies.get('token')?.value ||
    request.cookies.get('jwt')?.value;

  const hasToken = Boolean(authToken);
  const hasValidToken = hasToken && !isTokenExpired(authToken);

 
  if (hasToken && !hasValidToken) {
    return clearAuthCookies(NextResponse.next());
  }

>>>>>>> Stashed changes
  return NextResponse.next();
}

// Run middleware only on the root route
export const config = {
  matcher: ['/'],
};
