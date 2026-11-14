/**
 * ============================================================================
 * AUTHENTICATION UTILITIES (JWT & Session Handling)
 * ============================================================================
 * 
 * Beginner's Guide to CareWallet Auth:
 * 
 * 1. What is a JWT (JSON Web Token)?
 *    When a user logs in, the server generates an encrypted string (JWT) containing
 *    their user ID. The client sends this token back with subsequent requests.
 * 
 * 2. Why use HttpOnly Cookies?
 *    Storing tokens in HttpOnly cookies prevents JavaScript running in the browser
 *    from reading the cookie directly. This protects users against XSS (Cross-Site Scripting) attacks.
 * 
 * 3. How does verification work?
 *    Whenever a protected API route or Server Component runs:
 *    a) It reads the token from the HTTP request (header or cookie).
 *    b) Decodes and verifies its cryptographic signature using `JWT_ACCESS_KEY`.
 *    c) Looks up the corresponding user in MongoDB via `userRepository`.
 *    d) Grants access if valid, or returns a 401 Unauthorized status if invalid or expired.
 */

import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { IUser } from "@/models/User";
import { userRepository } from "@/repositories/user.repository";

/**
 * Shape of the decoded JWT payload.
 * - userId: MongoDB user document _id (as a string)
 * - iat: "issued at" timestamp
 * - exp: "expiration" timestamp
 */
export interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

/**
 * Verifies a JWT access token string and retrieves the corresponding User from the database.
 * 
 * @param token - The raw JWT token string (optional or null if not provided)
 * @returns Object with user (if valid), error message (if invalid), and HTTP status code
 */
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

/**
 * Extracts and verifies the user from an incoming Next.js API Request (`NextRequest`).
 * Looks first at custom HTTP header `accessToken`, then falls back to HttpOnly cookie.
 * 
 * @param req - The Next.js API Route request
 */
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

/**
 * Helper specifically for Next.js Server Components.
 * Reads the token from the incoming request cookies and returns the authenticated User (or null).
 */
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

/**
 * Security configuration for storing the accessToken cookie.
 * 
 * - httpOnly: true -> Disallows JavaScript `document.cookie` access (prevents XSS leaks)
 * - secure: true in production -> Only transmitted over HTTPS
 * - sameSite: "lax" -> Protects against Cross-Site Request Forgery (CSRF)
 * - maxAge: 30 days -> Keeps the user logged in for 30 days
 * - path: "/" -> Available across all routes in the app
 */
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
