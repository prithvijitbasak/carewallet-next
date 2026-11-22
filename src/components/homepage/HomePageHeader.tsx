"use client";

import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setAuthModalOpen } from "@/redux/slices/uiSlice";

export default function HomePageHeader() {
  const dispatch = useAppDispatch();
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
          <button
            type="button"
            onClick={() => dispatch(setAuthModalOpen(true))}
            className="px-4 py-2 bg-[#4caf50] text-white rounded-full hover:bg-[#43a047] transition-all duration-300 text-sm sm:text-base font-medium cursor-pointer"
          >
            Get Started
          </button>
        )}
      </nav>
    </header>
  );
}
