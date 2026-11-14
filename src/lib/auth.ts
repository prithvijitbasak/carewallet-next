// Authentication utilities for JWT verification and session handling

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { IUser } from "@/models/User";
import { userRepository } from "@/repositories/user.repository";

// Decoded JWT payload containing userId and timestamps
export interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

// Verifies a JWT access token string and retrieves the corresponding User from the database
export async function verifyUserToken(
  token?: string | null
): Promise<{ user: IUser | null; error: string | null; status: number }> {
  // Step 1: Check if token is present
  if (!token) {
    return {
      user: null,
      error: "Unauthorized: Access token not provided!",
      status: 401,
    };
  }

  try {
    // Step 2: Cryptographically verify the token against our secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_KEY as string
    ) as DecodedToken;

    // Step 3: Validate that the token payload actually contains a userId
    if (!decoded || !decoded.userId) {
      return {
        user: null,
        error: "Unauthorized: Invalid token payload!",
        status: 401,
      };
    }

    // Step 4: Fetch user data from MongoDB (excluding password and version key)
    const userData = await userRepository.findById(decoded.userId);

    if (!userData) {
      return {
        user: null,
        error: "Unauthorized: User not found or session invalid!",
        status: 401,
      };
    }

    // Step 5: Success! User authenticated
    return { user: userData, error: null, status: 200 };
  } catch (error: unknown) {
    // Distinguish token expiration from general token corruption/tampering
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "TokenExpiredError"
    ) {
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

// Extracts and verifies the user from an incoming Next.js API request header or cookie
export async function getAuthenticatedUser(
  req: NextRequest
): Promise<{ user: IUser | null; error: string | null; status: number }> {
  // 1. Check custom request header "accessToken" (raw token value)
  let token =
    req.headers.get("accessToken")?.trim() ||
    req.headers.get("accesstoken")?.trim();

  // 2. Check Cookie for standard browser requests
  if (!token) {
    token = req.cookies.get("accessToken")?.value;
  }

  return verifyUserToken(token);
}

// Retrieves the authenticated user from server component cookies
export async function getAuthenticatedUserFromCookies(): Promise<IUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    const { user } = await verifyUserToken(token);
    return user;
  } catch {
    return null;
  }
}

// Security configuration for storing the accessToken cookie (HttpOnly, Secure, SameSite)
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
