import { NextRequest } from "next/server";
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

    if (!userData) {
      return {
        user: null,
        error: "Unauthorized: User not found or session invalid!",
        status: 401,
      };
    }

    return { user: userData, error: null, status: 200 };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return {
        user: null,
        error: "Unauthorized: Access token has expired.",
        status: 401,
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
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    path: "/",
  },
};
