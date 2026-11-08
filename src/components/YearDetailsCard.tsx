"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-gray-900 font-bold text-lg pb-2">
          This Year Expenses
        </h3>
        <p className="text-gray-700 font-medium text-base pb-5">
          Total Expenses ={" "}
          <span className="font-bold text-red-600">
            {totalExpense !== null
              ? `₹${Number(totalExpense).toFixed(2)}`
              : "Loading..."}
          </span>
        </p>
      </div>
      <div>
        <Link
          href={
            username ? `/${username}/year-details?year=${currentYear}` : "#"
          }
          className="inline-block bg-[#4caf50] hover:bg-[#43a047] text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm shadow-sm"
        >
          See Details
        </Link>
      </div>
    </div>
  );
};

export default YearDetailsCard;
