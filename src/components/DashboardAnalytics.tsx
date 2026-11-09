"use client";

import React, { useEffect, useState } from "react";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="font-bold text-center pb-4 text-gray-800 text-lg underline underline-offset-4">
          Expenses of this month
        </h3>
        {activeMonth && activeYear && (
          <MonthAndYearChart
            typeOfChart="month"
            month={activeMonth}
            year={activeYear}
            initialData={monthAnalytics}
          />
        )}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="font-bold text-center pb-4 text-gray-800 text-lg underline underline-offset-4">
          Expenses of this year
        </h3>
        {activeYear && (
          <MonthAndYearChart
            typeOfChart="year"
            year={activeYear}
            initialData={yearAnalytics}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardAnalytics;
