import { cookies, headers } from "next/headers";

export interface SsrFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Server-side fetch wrapper for SSR API calls.
 * Automatically forwards cookies (auth tokens) and resolves host for internal API routes.
 */
export async function ssrFetch<T = any>(
  endpoint: string,
  options: SsrFetchOptions = {}
): Promise<T | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (options.requireAuth && !token) {
      return null;
    }

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

    const mergedHeaders: HeadersInit = {
      ...(token ? { accessToken: token } : {}),
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
  } catch (error) {
    console.error(`Error in ssrFetch for ${endpoint}:`, error);
  }

  return null;
}

export default ssrFetch;
