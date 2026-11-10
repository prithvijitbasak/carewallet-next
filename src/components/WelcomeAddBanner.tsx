"use client";

import React from "react";
import Link from "next/link";
import { Plus, BarChart3, Sparkles } from "lucide-react";
import { ShimmerBar } from "./ShimmerUI";
import { useAuth } from "@/hooks/useAuth";

interface WelcomeAddBannerProps {
  fullName?: string;
  username?: string;
}

const WelcomeAddBanner: React.FC<WelcomeAddBannerProps> = ({
  fullName: initialFullName,
  username: initialUsername,
}) => {
  const { user } = useAuth();
  const displayName = initialFullName || user?.fullName;
  const username = initialUsername || user?.username;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-6 md:p-8 border border-emerald-100 shadow-sm">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#4caf50]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-32 -bottom-16 h-36 w-36 rounded-full bg-[#4caf50]/5 blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4caf50]/10 text-[#4caf50] text-xs font-semibold mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4caf50] animate-pulse" />
            <span>Financial Overview</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2 flex-wrap">
            <span>Welcome back,</span>
            <span className="text-[#4caf50]">
              {!displayName ? <ShimmerBar /> : displayName}
            </span>
            <span>👋</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-xl">
            Track and manage your day-to-day expenses, inspect spending trends,
            and stay ahead of your financial goals.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={username ? `/${username}/add-expense` : "#"}
            className="inline-flex items-center gap-2 bg-[#4caf50] hover:bg-[#43a047] active:scale-[0.98] text-white font-semibold py-3 px-5 rounded-2xl shadow-md shadow-[#4caf50]/20 hover:shadow-lg hover:shadow-[#4caf50]/30 transition-all text-sm group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Add Expense</span>
          </Link>
          <Link
            href={username ? `/${username}/analytics` : "#"}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-700 font-medium py-3 px-5 rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm transition-all text-sm"
          >
            <BarChart3 className="w-4 h-4 text-[#4caf50]" />
            <span>Analytics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAddBanner;
