/**
 * ============================================================================
 * SSR FETCH UTILITY (Server-Side Internal Request Helper)
 * ============================================================================
 * 
 * Why does this file exist?
 * In Next.js App Router, Server Components run exclusively on the Node server.
 * When a Server Component needs to fetch data from an internal `/api/...` route:
 * 1. It does NOT automatically know the domain/host (e.g., http://localhost:3000 vs https://carewallet.com).
 * 2. It does NOT automatically attach the user's browser cookies or authentication headers.
 * 
 * What `ssrFetch` does:
 * - Reads current request headers (`host`, `x-forwarded-proto`) to construct the absolute URL.
 * - Extracts the `accessToken` cookie from the incoming visitor request and forwards it.
 * - Automatically returns parsed JSON data or `null` if unauthorized / failed.
 */

import { cookies, headers } from "next/headers";

/**
 * Options for `ssrFetch`, extending standard web `RequestInit` (fetch options).
 * - `requireAuth`: When true, immediately returns null if no valid token cookie is found.
 */
export interface SsrFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Server-side fetch wrapper for making internal API calls within Server Components.
 * 
 * @param endpoint - Relative URL path (e.g. "/api/ssr/dashboard") or absolute URL.
 * @param options - Standard fetch options plus `requireAuth`.
 * @returns The parsed JSON data typed as `T`, or `null` if request failed.
 */
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
