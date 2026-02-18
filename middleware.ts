import { NextRequest, NextResponse } from "next/server";

// ── Protected routes ─────────────────────────────────────────
// Any path starting with /dashboard requires authentication
// /admin/login is public (the login page itself)

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check for admin session cookie
  const adminSession = req.cookies.get("admin_session")?.value;

  const isLoginPage     = pathname === "/login";
  const isDashboardPage = pathname.startsWith("/dashboard");

  // If trying to access dashboard without session → redirect to login
  if (isDashboardPage && !adminSession) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and visiting login page → redirect to dashboard
  if (isLoginPage && adminSession) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};