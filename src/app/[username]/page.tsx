import React from "react";
import DashBanner from "@/components/DashBanner";
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

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8">
      <DashBanner />

      <div className="flex justify-end">
        <ClockCard />
      </div>

      <WelcomeAddBanner fullName={fullName} username={username} />

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

      <SearchBoxSection />
      <DashboardAnalytics />
    </div>
  );
}
