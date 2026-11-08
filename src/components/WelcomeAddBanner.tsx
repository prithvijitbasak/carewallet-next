"use client";

import React from "react";
import Link from "next/link";
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
    <div className="flex flex-col md:flex-row justify-between gap-6 pt-8">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex-1">
        <p className="text-gray-500 text-lg font-medium pb-2">Welcome,</p>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
          {!displayName ? <ShimmerBar /> : displayName}
        </h3>
      </div>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-gray-800 text-base md:text-lg font-semibold pb-1">
            Have spent money on something?
          </p>
          <p className="text-gray-600 text-sm md:text-base pb-4">
            Add your expenses below &darr;
          </p>
        </div>
        <div>
          <Link
            href={username ? `/${username}/add-expense` : "#"}
            className="inline-block bg-[#4caf50] hover:bg-[#43a047] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-sm"
          >
            Add Expense
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAddBanner;
