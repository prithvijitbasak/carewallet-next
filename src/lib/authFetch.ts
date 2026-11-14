// Server-side internal fetch helper with cookie forwarding and host resolution

import { cookies, headers } from "next/headers";

// Options for ssrFetch extending RequestInit with requireAuth flag
export interface SsrFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

// Server-side fetch wrapper for making authenticated internal API calls in Server Components
export async function ssrFetch<T = unknown>(
  endpoint: string,
  options: SsrFetchOptions = {}
): Promise<T | null> {
  try {
    // 1. Retrieve the incoming cookies to forward authentication tokens
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    // If authentication is required and user is not logged in, bail out early
    if (options.requireAuth && !token) {
      return null;
    }

    // 2. Discover the current host and protocol so we can build a valid URL
    const headersList = await headers();
    const host = headersList.get("host");

    if (!host) {
      return null;
    }

    const protocol =
      headersList.get("x-forwarded-proto") ||
      (process.env.NODE_ENV === "production" ? "https" : "http");

    const baseUrl = endpoint.startsWith("http")
      ? ""
      : `${protocol}://${host}`;

    const url = `${baseUrl}${endpoint}`;
    const cookieHeader = cookieStore.toString();

    // 3. Merge headers: attach token in accessToken header & forward cookies
    const mergedHeaders: HeadersInit = {
      ...(token ? { accessToken: token } : {}),
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
      ...(options.headers || {}),
    };

    // 4. Perform the server-to-server HTTP request
    const res = await fetch(url, {
      ...options,
      headers: mergedHeaders,
      cache: options.cache || "no-store", // By default, don't cache SSR calls
    });

    if (res.ok) {
      const data = await res.json();
      return data as T;
    }
  } catch (error) {
    console.error(`Error in ssrFetch for ${endpoint}:`, error);
  }

  return null;
}

export default ssrFetch;
