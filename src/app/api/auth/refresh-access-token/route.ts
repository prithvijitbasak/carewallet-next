import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookieOptions, DecodedToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "Access Denied" }, { status: 401 });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_KEY as string
      ) as DecodedToken;

      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_ACCESS_KEY as string,
        { expiresIn: "15m" }
      );

      const response = NextResponse.json(
        { message: "Refreshed Successfully" },
        { status: 200 }
      );

      response.cookies.set(
        cookieOptions.accessToken.name,
        accessToken,
        cookieOptions.accessToken
      );

      return response;
    } catch {
      return NextResponse.json(
        { message: "Invalid Refresh Token" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
