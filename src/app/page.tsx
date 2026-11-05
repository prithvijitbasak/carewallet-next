import React from "react";
import HomeStoreProvider from "@/redux/HomeStoreProvider";
import HomePageContents from "@/components/homepage/HomePageContents";
import { ssrFetch } from "@/lib/authFetch";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { isLogin, user } = await ssrFetch("/api/ssr/home");
  const currentYear = new Date().getFullYear();

  return (
    <HomeStoreProvider
      authState={{
        isLogin: Boolean(isLogin),
        user: user || null,
        loading: false,
      }}
    >
      <HomePageContents currentYear={currentYear} />
    </HomeStoreProvider>
  );
}
