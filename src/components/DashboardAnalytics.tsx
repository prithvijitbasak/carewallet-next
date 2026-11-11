"use client";

import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import MonthAndYearChart, {
  ExpenseCategoryItem,
} from "./analytics/MonthAndYearChart";

interface DashboardAnalyticsProps {
  monthAnalytics?: ExpenseCategoryItem[];
  yearAnalytics?: ExpenseCategoryItem[];
  month?: number;
  year?: number;
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  monthAnalytics,
  yearAnalytics,
  month: propMonth,
  year: propYear,
}) => {
  const [month, setMonth] = useState<number | null>(propMonth ?? null);
  const [year, setYear] = useState<number | null>(propYear ?? null);

  useEffect(() => {
    if (propYear !== undefined) {
      setYear(propYear);
    } else if (!year) {
      setYear(new Date().getFullYear());
    }

    if (propMonth !== undefined) {
      setMonth(propMonth);
    } else if (!month) {
      setMonth(new Date().getMonth() + 1);
    }
  }, [propMonth, propYear, month, year]);

  const activeMonth = propMonth ?? month;
  const activeYear = propYear ?? year;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentMonthName = activeMonth
    ? monthNames[Number(activeMonth) - 1]
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-1">
        <div className="w-10 h-10 rounded-2xl bg-[#4caf50]/10 text-[#4caf50] flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900">
            Spending Breakdown
          </h3>
          <p className="text-xs md:text-sm text-gray-500">
            Category distribution of your monthly and annual expenses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 md:p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4">
            <div>
              <h4 className="font-bold text-gray-900 text-base">
                Monthly Breakdown
              </h4>
              <p className="text-xs text-gray-400">By category</p>
            </div>
            {currentMonthName && activeYear && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#4caf50] border border-emerald-100">
                {currentMonthName} {activeYear}
              </span>
            )}
          </div>
          {activeMonth && activeYear && (
            <MonthAndYearChart
              typeOfChart="month"
              month={activeMonth}
              year={activeYear}
              initialData={monthAnalytics}
            />
          )}
        </div>

        <div className="bg-white p-6 md:p-7 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4">
            <div>
              <h4 className="font-bold text-gray-900 text-base">
                Annual Breakdown
              </h4>
              <p className="text-xs text-gray-400">By category</p>
            </div>
            {activeYear && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#4caf50] border border-emerald-100">
                Year {activeYear}
              </span>
            )}
          </div>
          {activeYear && (
            <MonthAndYearChart
              typeOfChart="year"
              year={activeYear}
              initialData={yearAnalytics}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
