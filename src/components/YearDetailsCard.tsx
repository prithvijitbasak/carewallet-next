"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface YearDetailsCardProps {
  totalThisYearExpenses?: number;
  initialTotalExpense?: number;
  username?: string;
}

const YearDetailsCard: React.FC<YearDetailsCardProps> = ({
  totalThisYearExpenses,
  initialTotalExpense,
  username: initialUsername,
}) => {
  const initialVal = totalThisYearExpenses ?? initialTotalExpense;
  const [totalExpense, setTotalExpense] = useState<number | null>(
    initialVal !== undefined ? initialVal : null
  );
  const { user } = useAuth();
  const username = initialUsername || user?.username;
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (initialVal !== undefined) return;

    const fetchTotalYearExpense = async () => {
      try {
        const response = await fetch(
          `/api/expenses/get-expenses-by-year?year=${currentYear}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setTotalExpense(data.totalExpenses);
        }
      } catch (error) {
        console.error("The error is: ", error);
      }
    };

    fetchTotalYearExpense();
  }, [currentYear, initialVal]);

  return (
    <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#4caf50]/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4caf50]/10 text-[#4caf50] flex items-center justify-center transition-transform group-hover:scale-105">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#4caf50] border border-emerald-100">
            {currentYear}
          </span>
        </div>

        <p className="text-sm font-medium text-gray-500">
          This Year&apos;s Expenses
        </p>
        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
          {totalExpense === null ? (
            <span className="text-gray-400 text-lg">Loading...</span>
          ) : (
            `₹${Number(totalExpense).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`
          )}
        </p>
      </div>

      <div className="pt-6 mt-2 border-t border-gray-50">
        <Link
          href={
            username ? `/${username}/year-details?year=${currentYear}` : "#"
          }
          className="inline-flex items-center text-sm font-semibold text-[#4caf50] hover:text-[#43a047] transition-colors"
        >
          <span>View year details</span>
          <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default YearDetailsCard;
