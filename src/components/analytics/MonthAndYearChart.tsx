"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface MonthAndYearChartProps {
  typeOfChart: "month" | "year";
  month?: number | string;
  year: number | string;
  initialData?: ExpenseCategoryItem[];
}

export interface ExpenseCategoryItem {
  category: string;
  totalAmount: number;
}

const MonthAndYearChart: React.FC<MonthAndYearChartProps> = ({
  typeOfChart,
  month,
  year,
  initialData,
}) => {
  const [expenseData, setExpenseData] = useState<ExpenseCategoryItem[]>(
    initialData && initialData.length > 0 ? initialData : []
  );
  const [loading, setLoading] = useState(
    !(initialData && initialData.length > 0)
  );

  const fetchURL =
    typeOfChart === "month"
      ? `/api/expenses/analytics/month?month=${month}&year=${year}`
      : `/api/expenses/analytics/year?year=${year}`;

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setExpenseData(initialData);
      setLoading(false);
      return;
    }

    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const response = await fetch(fetchURL, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setExpenseData(data);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [typeOfChart, month, year, fetchURL, initialData]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
        Loading chart data...
      </div>
    );
  }

  if (!expenseData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
        No expense data available
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={expenseData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#e5e7eb"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(76, 175, 80, 0.08)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                return (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-2.5 text-xs">
                    <p className="font-semibold text-gray-800 mb-1">{label}</p>
                    <p className="text-[#4caf50] font-medium">
                      ₹{Number(payload[0].value).toLocaleString()}
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="totalAmount"
              name="Expenses"
              fill="#4caf50"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {typeOfChart === "month" ? "Monthly Breakdown" : "Yearly Breakdown"}
      </p>
    </div>
  );
};

export default MonthAndYearChart;
