"use client";

import React from "react";
import WeeklyExpenseChart from "@/components/analytics/WeeklyExpenseChart";
import DashboardAnalytics from "@/components/DashboardAnalytics";

export default function AnalyticsPage() {
  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics & Insights</h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor and analyze your spending trends over time
        </p>
      </div>

      <WeeklyExpenseChart />
      <DashboardAnalytics />
    </div>
  );
}
