"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useTotalExpense from "@/hooks/useTotalExpense";

interface MonthDetailsCardProps {
  totalThisMonthExpenses?: number;
  initialTotalExpenses?: number;
  username?: string;
}

const MonthDetailsCard: React.FC<MonthDetailsCardProps> = ({
  totalThisMonthExpenses,
  initialTotalExpenses,
  username: initialUsername,
}) => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const monthName = date.toLocaleString("en-US", { month: "short" });
  const { user } = useAuth();
  const username = initialUsername || user?.username;

  const initialVal = totalThisMonthExpenses ?? initialTotalExpenses;
  const isInitialProvided = initialVal !== undefined;

  const { total, loading, error } = useTotalExpense(
    "month",
    { month, year },
    { enabled: !isInitialProvided }
  );

  const displayTotal = isInitialProvided ? initialVal : total;

  return (
    <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#4caf50]/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4caf50]/10 text-[#4caf50] flex items-center justify-center transition-transform group-hover:scale-105">
            <CalendarDays className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#4caf50] border border-emerald-100">
            {monthName} {year}
          </span>
        </div>

        <p className="text-sm font-medium text-gray-500">
          This Month&apos;s Expenses
        </p>
        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
          {!isInitialProvided && loading ? (
            <span className="text-gray-400 text-lg">Loading...</span>
          ) : !isInitialProvided && error ? (
            <span className="text-red-500 text-lg">Error</span>
          ) : (
            `₹${Number(displayTotal).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          )}
        </p>
      </div>

      <div className="pt-6 mt-2 border-t border-gray-50">
        <Link
          href={
            username
              ? `/${username}/month-details?month=${month}&year=${year}`
              : "#"
          }
          className="inline-flex items-center text-sm font-semibold text-[#4caf50] hover:text-[#43a047] transition-colors"
        >
          <span>View month details</span>
          <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default MonthDetailsCard;
