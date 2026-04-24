import { NextResponse } from "next/server";

import { auth } from "@/auth";

const employeeAllowedPaths = new Set(["/employee-dashboard"]);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute =
    pathname === "/dashboard" ||
    pathname === "/employee-dashboard" ||
    pathname.startsWith("/users") ||
    pathname.startsWith("/roles") ||
    pathname.startsWith("/module") ||
    pathname.startsWith("/companies") ||
    pathname.startsWith("/employers") ||
    pathname.startsWith("/employee-profiles") ||
    pathname.startsWith("/employee-documents") ||
    pathname.startsWith("/department") ||
    pathname.startsWith("/work-location") ||
    pathname.startsWith("/transfer-promotion");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!req.auth?.user?.id) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    req.auth.user.role?.toLowerCase() === "employee" &&
    !employeeAllowedPaths.has(pathname)
  ) {
    return NextResponse.redirect(new URL("/employee-dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard",
    "/employee-dashboard",
    "/users/:path*",
    "/roles/:path*",
    "/module/:path*",
    "/companies/:path*",
    "/employers/:path*",
    "/employee-profiles/:path*",
    "/employee-documents/:path*",
    "/department/:path*",
    "/work-location/:path*",
    "/transfer-promotion/:path*",
  ],
};
