import { NextResponse } from "next/server";

export default function middleware() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/learn/:path*",
    "/my-courses/:path*",
    "/student/checkout/:path*",
    "/student/profile/:path*",
    "/student/redeem-code/:path*",
    "/settings/:path*",
    "/api/my-courses/:path*",
    "/api/courses/:path*/access",
    "/admin/:path*",
    "/courses/:path*",
    "/activation-codes/:path*",
    "/students/:path*",
    "/orders/:path*",
    "/learning/:path*",
  ],
};
