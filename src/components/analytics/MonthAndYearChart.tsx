"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  if (loading || !expenseData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
        Loading chart data...
      </div>
    );
  }

  const labels = expenseData.map((item) => item.category);
  const values = expenseData.map((item) => item.totalAmount);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Expenses",
        data: values,
        backgroundColor: "rgba(76, 175, 80, 0.6)",
        borderColor: "rgba(76, 175, 80, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: typeOfChart === "month" ? "Monthly Breakdown" : "Yearly Breakdown",
        position: "bottom" as const,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Categories" },
        ticks: { font: { size: 10 } },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (₹)" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthAndYearChart;
