/**
 * ============================================================================
 * LANDING / HOME PAGE (`/`)
 * ============================================================================
 * 
 * Beginner's Guide to this Page:
 * 
 * 1. Server-Side Authentication Check:
 *    When a visitor lands on the homepage, Next.js checks their cookies on the server
 *    (`getAuthenticatedUserFromCookies()`).
 * 
 * 2. Instant Hydration via `HomeStoreProvider`:
 *    Instead of showing a flash of "Logged Out" state while the client makes a network call,
 *    we pass `authState` (`isLogin`, `user`) directly into `<HomeStoreProvider>`.
 * 
 * 3. Dynamic Rendering:
 *    `export const dynamic = "force-dynamic"` tells Next.js to render this page fresh
 *    on every request so cookie changes (logging in/out) take effect immediately.
 */

import React from "react";
import HomeStoreProvider from "@/redux/HomeStoreProvider";
import HomePageContents from "@/components/homepage/HomePageContents";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";

// Render dynamically on demand so user auth cookies are always fresh
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Check if visitor has a valid active session token
  const authUser = await getAuthenticatedUserFromCookies();
  const isLogin = Boolean(authUser);
  const user = authUser
    ? {
        fullName: authUser.fullName,
        username: authUser.username,
      }
    : null;
  const currentYear = new Date().getFullYear();

  return (
    <HomeStoreProvider
      authState={{
        isLogin,
        user,
        loading: false,
      }}
    >
      {/* Visual presentation component for the landing page */}
      <HomePageContents currentYear={currentYear} />
    </HomeStoreProvider>
  );
}
