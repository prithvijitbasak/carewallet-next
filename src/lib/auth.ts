import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDb from "./db";
import User, { IUser } from "@/models/User";

export interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

export async function getAuthenticatedUser(
  req: NextRequest
): Promise<{ user: IUser | null; error: string | null; status: number }> {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return {
        user: null,
        error: "Unauthorized: Access token not provided!",
        status: 401,
      };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_KEY as string
    ) as DecodedToken;

    if (!decoded || !decoded.userId) {
      return {
        user: null,
        error: "Unauthorized: Invalid token payload!",
        status: 401,
      };
    }

    await connectDb();
    const userData = await User.findById(decoded.userId).select("-password -__v");

    if (!userData || !userData.refreshToken) {
      return {
        user: null,
        error: "Unauthorized: Session expired or user logged out!",
        status: 401,
      };
    }

    return { user: userData, error: null, status: 200 };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return {
        user: null,
        error: "Forbidden: Access token has expired. Refresh required.",
        status: 403,
      };
    }

    return {
      user: null,
      error: "Unauthorized: Invalid token!",
      status: 401,
    };
  }
}

export const cookieOptions = {
  accessToken: {
    name: "accessToken",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 6 * 60 * 60, // 6 hours in seconds
    path: "/",
  },
  refreshToken: {
    name: "refreshToken",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  },
};
