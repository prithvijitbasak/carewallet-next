import React from "react";
import { cookies, headers } from "next/headers";
import HomeStoreProvider from "@/redux/HomeStoreProvider";
import HomePageContents from "@/components/homepage/HomePageContents";
import jwt from "jsonwebtoken";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { DecodedToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function fetchHomeSsrData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return { isLogin: false, user: null };
  }

  // Call the homepage SSR API
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    if (host) {
      const protocol =
        headersList.get("x-forwarded-proto") ||
        (process.env.NODE_ENV === "production" ? "https" : "http");
      const apiUrl = `${protocol}://${host}/api/ssr/home`;
      const res = await fetch(apiUrl, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });
      if (res.ok) {
        return await res.json();
      }
    }
  } catch {
    // If internal fetch cannot connect (e.g. during build / cold start), fallback to direct DB/auth verification
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_KEY as string
    ) as DecodedToken;

    if (decoded?.userId) {
      await connectDb();
      const userData = await User.findById(decoded.userId).select(
        "fullName username refreshToken"
      );
      if (userData && userData.refreshToken) {
        return {
          isLogin: true,
          user: {
            fullName: userData.fullName,
            username: userData.username,
          },
        };
      }
    }
  } catch {
    // Token invalid or expired
  }

  return { isLogin: false, user: null };
}

export default async function HomePage() {
  // Call the homepage SSR API 
  // Get the data and pass it into the store provider for HomePageContents
  const ssrData = await fetchHomeSsrData();
  const currentYear = new Date().getFullYear();

  return (
    <HomeStoreProvider
      authState={{
        isLogin: ssrData.isLogin,
        user: ssrData.user,
        loading: false,
      }}
    >
      <HomePageContents currentYear={currentYear} />
    </HomeStoreProvider>
  );
}
