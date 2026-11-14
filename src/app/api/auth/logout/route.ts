/**
 * ============================================================================
 * LOGOUT API ROUTE (`POST /api/auth/logout`)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * How does logging out work with HttpOnly Cookies?
 * Because HttpOnly cookies cannot be modified by JavaScript in the browser,
 * the client must tell the server to expire the cookie.
 * 
 * To invalidate the session cookie:
 * We set `maxAge: 0` on the "accessToken" cookie in the HTTP response.
 * The browser sees `maxAge: 0` and immediately deletes the cookie from its storage.
 */

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Invalidate the auth cookie by setting maxAge to 0 seconds
    response.cookies.set("accessToken", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
