"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Receipt, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DayDetailsCardProps {
  totalTodayExpenses?: number;
  initialTotalExpenses?: number;
  username?: string;
}

const DayDetailsCard: React.FC<DayDetailsCardProps> = ({
  totalTodayExpenses,
  initialTotalExpenses,
  username: initialUsername,
}) => {
  const initialValue = totalTodayExpenses ?? initialTotalExpenses;
  const [totalExpenses, setTotalExpenses] = useState<number>(initialValue ?? 0);
  const { user } = useAuth();
  const username = initialUsername || user?.username;

  const today = new Date();
  const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  const fetchTotalExpense = async () => {
    try {
      const response = await fetch(
        `/api/expenses/get-expenses-by-date?date=${formattedDate}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTotalExpenses(data.totalExpenses);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (initialValue === undefined) {
      fetchTotalExpense();
    }
  }, [initialValue]);

  return (
    <div className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#4caf50]/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#4caf50]/10 text-[#4caf50] flex items-center justify-center transition-transform group-hover:scale-105">
            <Receipt className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-[#4caf50] border border-emerald-100">
            Today
          </span>
        </div>

        <p className="text-sm font-medium text-gray-500">Today&apos;s Expenses</p>
        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
          ₹{Number(totalExpenses).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <div className="pt-6 mt-2 border-t border-gray-50">
        <Link
          href={
            username ? `/${username}/day-details?date=${formattedDate}` : "#"
          }
          className="inline-flex items-center text-sm font-semibold text-[#4caf50] hover:text-[#43a047] transition-colors"
        >
          <span>View day details</span>
          <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default DayDetailsCard;
