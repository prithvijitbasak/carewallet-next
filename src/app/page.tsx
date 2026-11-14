// Landing page with server-side authentication check and hydration

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
