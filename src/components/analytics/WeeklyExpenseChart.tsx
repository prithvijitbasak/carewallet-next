"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const WeeklyExpenseChart: React.FC = () => {
  const [last7DaysData, setLast7DaysData] = useState<any[]>([]);

  useEffect(() => {
    const fetchLast7DaysData = async () => {
      try {
        const res = await fetch("/api/expenses/analytics/last7days", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setLast7DaysData(data);
        }
      } catch (error) {
        console.error("Error fetching weekly analytics:", error);
      }
    };

    fetchLast7DaysData();
  }, []);

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

  return (
    <div className="mx-2 md:mx-6 my-8 bg-white shadow-xl rounded-3xl p-6 md:p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#4caf50]">
          Weekly Expense Overview
        </h2>
        <span className="text-sm text-gray-400">Last 7 days</span>
      </div>

      <div className="w-full h-[320px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7DaysData} barSize={36} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#e5e7eb"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
            />

            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} />

            <Tooltip
              cursor={{ fill: "rgba(76, 175, 80, 0.08)" }}
              content={<CustomTooltip />}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
            />

            {Object.entries(CATEGORY_COLORS).map(([category, color], index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={color}
                radius={index === 0 ? [6, 6, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyExpenseChart;
