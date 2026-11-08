"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-gray-900 font-bold text-lg pb-2">Today expenses</h3>
        <p className="text-gray-700 font-medium text-base pb-5">
          Total Expenses ={" "}
          <span className="font-bold text-red-600">
            ₹{Number(totalExpenses).toFixed(2)}
          </span>
        </p>
      </div>
      <div>
        <Link
          href={
            username ? `/${username}/day-details?date=${formattedDate}` : "#"
          }
          className="inline-block bg-[#4caf50] hover:bg-[#43a047] text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm shadow-sm"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default DayDetailsCard;
