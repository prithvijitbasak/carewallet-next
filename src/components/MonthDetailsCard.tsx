"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import useTotalExpense from "@/hooks/useTotalExpense";

const MonthDetailsCard: React.FC = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const { user } = useAuth();

  const { total, loading, error } = useTotalExpense("month", {
    month,
    year,
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-gray-900 font-bold text-lg pb-2">
          This Month Expenses
        </h3>
        <p className="text-gray-700 font-medium text-base pb-5">
          Total Expenses ={" "}
          <span className="font-bold text-red-600">
            {loading
              ? "Loading..."
              : error
              ? "Error"
              : `₹${Number(total).toFixed(2)}`}
          </span>
        </p>
      </div>
      <div>
        <Link
          href={`/${user?.username}/month-details?month=${month}&year=${year}`}
          className="inline-block bg-[#4caf50] hover:bg-[#43a047] text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm shadow-sm"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default MonthDetailsCard;
