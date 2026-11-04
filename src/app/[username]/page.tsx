"use client";

import React from "react";
import DashBanner from "@/components/DashBanner";
import ClockCard from "@/components/ClockCard";
import WelcomeAddBanner from "@/components/WelcomeAddBanner";
import DayDetailsCard from "@/components/DayDetailsCard";
import MonthDetailsCard from "@/components/MonthDetailsCard";
import YearDetailsCard from "@/components/YearDetailsCard";
import SearchBoxSection from "@/components/SearchBoxSection";
import DashboardAnalytics from "@/components/DashboardAnalytics";

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8">
      <DashBanner />

      <div className="flex justify-end">
        <ClockCard />
      </div>

      <WelcomeAddBanner />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DayDetailsCard />
        <MonthDetailsCard />
        <YearDetailsCard />
      </div>

      <SearchBoxSection />
      <DashboardAnalytics />
    </div>
  );
}
