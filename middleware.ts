import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route Protection Middleware
 * 
 * OWASP Security Best Practices Implemented:
 * - Authentication checks before accessing protected resources
 * - Redirect unauthenticated users to login with return URL
 * - Prevent authenticated users from accessing auth pages
 * - Cookie-based session management (in production, use httpOnly, secure flags)
 * 
 * Protected Routes: /discover, /profile, /book/*
 * Public Routes: /, /login, /signup, /guest
 */

// Protected routes that require authentication
const protectedRoutes = ["/discover", "/profile", "/book"];

// Public routes that should redirect to discover if already authenticated
const authRoutes = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated (simple cookie check)
  const isAuthenticated = request.cookies.has("clankers_token");
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  
  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect authenticated users away from auth pages (optional)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/discover", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

