import React from "react";
import ClockCard from "@/components/ClockCard";
import WelcomeAddBanner from "@/components/WelcomeAddBanner";
import DayDetailsCard from "@/components/DayDetailsCard";
import MonthDetailsCard from "@/components/MonthDetailsCard";
import YearDetailsCard from "@/components/YearDetailsCard";
import SearchBoxSection from "@/components/SearchBoxSection";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import { ssrFetch } from "@/lib/authFetch";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  params: Promise<{ username: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const resolvedParams = await params;
  const routeUsername = resolvedParams?.username;

  const data = await ssrFetch("/api/ssr/dashboard", { requireAuth: true });

  const fullName = data?.fullName || data?.user?.fullName || "";
  const username = data?.username || data?.user?.username || routeUsername;
  const totalTodayExpenses =
    data?.totalTodayExpenses ?? data?.todayExpenses ?? 0;
  const totalThisMonthExpenses =
    data?.totalThisMonthExpenses ?? data?.monthExpenses ?? 0;
  const totalThisYearExpenses =
    data?.totalThisYearExpenses ?? data?.yearExpenses ?? 0;
  const monthAnalytics = data?.monthAnalytics ?? [];
  const yearAnalytics = data?.yearAnalytics ?? [];
  const month = data?.month ?? new Date().getMonth() + 1;
  const year = data?.year ?? new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8">
      {/* Top Header Bar with Live Clock */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
            Dashboard
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            Welcome to CareWallet expense tracking system.
          </p>
        </div>
        <ClockCard />
      </div>

      {/* Hero Greeting & Quick Actions */}
      <WelcomeAddBanner fullName={fullName} username={username} />

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DayDetailsCard
          totalTodayExpenses={totalTodayExpenses}
          username={username}
        />
        <MonthDetailsCard
          totalThisMonthExpenses={totalThisMonthExpenses}
          username={username}
        />
        <YearDetailsCard
          totalThisYearExpenses={totalThisYearExpenses}
          username={username}
        />
      </div>

      {/* Analytics Charts */}
      <DashboardAnalytics
        monthAnalytics={monthAnalytics}
        yearAnalytics={yearAnalytics}
        month={month}
        year={year}
      />

      {/* Search & Lookup */}
      <SearchBoxSection />
    </div>
  );
}
