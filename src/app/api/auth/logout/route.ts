// Handles user logout by invalidating the HTTP-only session cookie

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
