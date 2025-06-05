import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Define API routes that require admin access
  const adminRoutes = ["/api/:path*"];

  // Define API routes that do not require a session
  const publicApiRoutes = [
    "/api/auth",
    "/api/images/(.*)",
    "/api/public/(.*)",
    "/api/register",
    "/api/check-stat",
    "/api/command",
    "/api/com-name",
    "/api/manage-items/command/",
    "/api/manage-items/uuid",
    "/api/manage-items/transaction/borrow",
    "/api/manage-items/transaction/return",
    "/api/notifications/(.*)",
  ];

  // Check if the user is trying to access an admin route
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    // If the user is trying to access an admin route
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else if (
    !session &&
    !publicApiRoutes.some((route) => pathname.startsWith(route))
  ) {
    // If no session and trying to access protected routes (excluding public API routes), redirect to login
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If the user is logged in and trying to access the login page, redirect to dashboard
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/login",
    "/api/:path*", // Match all API routes
  ],
};
