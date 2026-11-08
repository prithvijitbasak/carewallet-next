import React from "react";
import HomeStoreProvider from "@/redux/HomeStoreProvider";
import HomePageContents from "@/components/homepage/HomePageContents";
import { getAuthenticatedUserFromCookies } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
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
      <HomePageContents currentYear={currentYear} />
    </HomeStoreProvider>
  );
}
