"use client";

import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";

export default function HomePageHeader() {
  const { isLogin, user } = useAppSelector((state) => state.auth);

  return (
    <header className="w-full bg-white shadow-md py-4 px-4 sm:px-6 flex justify-between items-center fixed top-0 z-50">
      <h1 className="text-xl sm:text-2xl font-bold text-[#4caf50]">
        Expense Tracker
      </h1>

      <nav className="space-x-3 sm:space-x-4 flex items-center">
        {isLogin && user ? (
          <Link
            href={`/${user.username}`}
            className="font-medium text-[#4caf50] hover:underline text-sm sm:text-base"
          >
            {user.fullName || "My Profile"}
          </Link>
        ) : (
          <>
            <Link
              href="/register"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4caf50] text-white rounded-full hover:bg-[#43a047] transition-all duration-300 text-sm sm:text-base font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="px-3 sm:px-4 py-1.5 sm:py-2 border border-[#4caf50] text-[#4caf50] rounded-full hover:bg-[#4caf50] hover:text-white transition-all duration-300 text-sm sm:text-base font-medium"
            >
              Sign In
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
