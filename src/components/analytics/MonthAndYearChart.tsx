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
  Cell,
} from "recharts";
import { Layers } from "lucide-react";

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

const CATEGORY_COLORS: Record<string, string> = {
  Savings: "#2e7d32",
  Food: "#f57c00",
  Transport: "#1976d2",
  Grocery: "#388e3c",
  Shopping: "#8e24aa",
  Bill: "#d32f2f",
  Medicine: "#0097a7",
  Entertainment: "#fbc02d",
  Investment: "#0288d1",
  Other: "#616161",
};

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
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
        <div className="w-6 h-6 border-2 border-[#4caf50] border-t-transparent rounded-full animate-spin" />
        <span>Loading chart data...</span>
      </div>
    );
  }

  if (!expenseData.length) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
          <Layers className="w-6 h-6" />
        </div>
        <p className="font-medium text-gray-500">No expenses found</p>
        <p className="text-xs text-gray-400">
          No transactions logged for this period yet.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={expenseData}
            margin={{ top: 12, right: 12, left: -10, bottom: 25 }}
          >
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="category"
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `₹${val}`}
            />
            <Tooltip
              cursor={{ fill: "rgba(76, 175, 80, 0.06)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const item = payload[0];
                const color =
                  CATEGORY_COLORS[String(label)] || "#4caf50";
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-3 text-xs min-w-[130px]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <p className="font-bold text-gray-800">{label}</p>
                    </div>
                    <p className="text-gray-500">
                      Amount:{" "}
                      <span className="font-extrabold text-[#4caf50]">
                        ₹{Number(item.value).toLocaleString()}
                      </span>
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="totalAmount"
              name="Expenses"
              radius={[6, 6, 0, 0]}
              barSize={32}
            >
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category] || "#4caf50"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs font-medium text-gray-400 mt-2">
        {typeOfChart === "month" ? "Monthly Breakdown" : "Yearly Breakdown"}
      </p>
    </div>
  );
};

export default MonthAndYearChart;
