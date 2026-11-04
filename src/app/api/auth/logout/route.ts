import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { getAuthenticatedUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);

    if (user) {
      await connectDb();
      await User.updateOne({ _id: user._id }, { $set: { refreshToken: null } });
    }

    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("accessToken", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    response.cookies.set("refreshToken", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
