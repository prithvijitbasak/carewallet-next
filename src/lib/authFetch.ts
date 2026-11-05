import { cookies, headers } from "next/headers";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { DecodedToken } from "@/lib/auth";

export interface SsrFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Server-side fetch wrapper for SSR API calls.
 * Automatically forwards cookies (auth tokens), resolves host for internal API routes,
 * and handles fallbacks.
 */
export async function ssrFetch<T = any>(
  endpoint: string,
  options: SsrFetchOptions = {}
): Promise<T> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    // Check if the request requires auth and user is logged out
    if (options.requireAuth && !token) {
      return { isLogin: false, user: null } as T;
    }

    const headersList = await headers();
    const host = headersList.get("host");

    if (host) {
      const protocol =
        headersList.get("x-forwarded-proto") ||
        (process.env.NODE_ENV === "production" ? "https" : "http");

      const baseUrl = endpoint.startsWith("http")
        ? ""
        : `${protocol}://${host}`;

      const url = `${baseUrl}${endpoint}`;
      const cookieHeader = cookieStore.toString();

      const mergedHeaders: HeadersInit = {
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
        ...(options.headers || {}),
      };

      const res = await fetch(url, {
        ...options,
        headers: mergedHeaders,
        cache: options.cache || "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        return data as T;
      }
    }
  } catch (error) {
    // If internal fetch cannot connect (e.g. during build / cold start), fallback to direct DB/auth verification
  }

  // Fallback: verify token directly
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_KEY as string
      ) as DecodedToken;

      if (decoded?.userId) {
        await connectDb();
        const userData = await User.findById(decoded.userId).select(
          "fullName username"
        );
        if (userData) {
          return {
            isLogin: true,
            user: {
              fullName: userData.fullName,
              username: userData.username,
            },
          } as T;
        }
      }
    }
  } catch {
    // Token invalid or expired
  }

  return { isLogin: false, user: null } as T;
}

export default ssrFetch;
