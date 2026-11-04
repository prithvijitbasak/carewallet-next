"use client";

import React, { useEffect, useState } from "react";
import MonthAndYearChart from "./analytics/MonthAndYearChart";

const DashboardAnalytics: React.FC = () => {
  const [month, setMonth] = useState<number | null>(null);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const currYear = new Date().getFullYear();
    setYear(currYear);
    const currMonth = new Date().getMonth() + 1;
    setMonth(currMonth);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-10">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="font-bold text-center pb-4 text-gray-800 text-lg underline underline-offset-4">
          Expenses of this month
        </h3>
        {month && year && (
          <MonthAndYearChart
            typeOfChart="month"
            month={month}
            year={year}
          />
        )}
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
        <h3 className="font-bold text-center pb-4 text-gray-800 text-lg underline underline-offset-4">
          Expenses of this year
        </h3>
        {year && (
          <MonthAndYearChart
            typeOfChart="year"
            year={year}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardAnalytics;
