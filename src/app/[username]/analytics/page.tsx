import React from "react";
import WeeklyExpenseChart from "@/components/analytics/WeeklyExpenseChart";
import DashboardAnalytics from "@/components/DashboardAnalytics";
import { ssrFetch } from "@/lib/authFetch";
import { AnalyticsData } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

interface AnalyticsPageProps {
  params: Promise<{ username: string }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const resolvedParams = await params;
  const routeUsername = resolvedParams?.username;

  const data = await ssrFetch<AnalyticsData>("/api/ssr/analytics", {
    requireAuth: true,
  });

  const weeklyAnalytics = data?.weeklyAnalytics ?? [];
  const monthAnalytics = data?.monthAnalytics ?? [];
  const yearAnalytics = data?.yearAnalytics ?? [];
  const month = data?.month ?? new Date().getMonth() + 1;
  const year = data?.year ?? new Date().getFullYear();

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and analyze your spending trends over time
        </p>
      </div>

      <WeeklyExpenseChart initialData={weeklyAnalytics} />
      <DashboardAnalytics
        monthAnalytics={monthAnalytics}
        yearAnalytics={yearAnalytics}
        month={month}
        year={year}
      />
    </div>
  );
}
