import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  const isAuthenticated = !!token;
  const isAdmin = token?.role === 'admin' && token?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const { pathname } = req.nextUrl;

  // Protect admin routes - require admin role
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect user routes - require authentication
  if (pathname.startsWith('/user') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Redirect authenticated users from auth pages
  if (pathname.startsWith('/auth') && isAuthenticated) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    } else {
      return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/auth/:path*']
};