import { NextResponse } from 'next/server';

export function middleware(request) {
  // If the user is not on the /login or /register page, redirect to /login
  const { pathname } = request.nextUrl;
  if (pathname === '/' || pathname === '/page' || pathname === '/page.js' || pathname === '/page.jsx') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

// Run middleware only on the root route
export const config = {
  matcher: ['/'],
};
