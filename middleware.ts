import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/*
// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/trades", "/profile", "/settings"];

// Define public routes that don't require authentication
const publicRoutes = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/support",
];
*/

export function middleware(request: NextRequest) {
  //const { pathname } = request.nextUrl;
  return NextResponse.next();

  /*
  // Check if user is authenticated (you'll need to implement this based on your auth solution)
  // For now, we'll use a simple cookie check - replace with your actual auth logic
  const isAuthenticated =
    request.cookies.has("session") || request.cookies.has("auth-token");

  // Allow access to public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If user is already authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && pathname.startsWith("/auth/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      // Store the attempted URL to redirect after login
      const loginUrl = new URL("/auth/sign-in", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Redirect root to sign-in for unauthenticated users, dashboard for authenticated
  if (pathname === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
  */
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
