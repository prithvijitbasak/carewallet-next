"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

interface NoExpenseCTAProps {
  typeOfExpense: "day" | "month" | string;
}

const NoExpenseCTA: React.FC<NoExpenseCTAProps> = ({ typeOfExpense }) => {
  const { user } = useAuth();
  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-2">
        No expenses found for the selected{" "}
        {typeOfExpense === "day" ? "day" : "month"}.
      </p>
      <p className="text-gray-700">
        Are there any expenses? Then add here:{" "}
        <Link
          href={`/${user?.username}/add-expense`}
          className="text-[#4caf50] font-semibold hover:underline"
        >
          Add Expense
        </Link>
      </p>
    </div>
  );
};

export default NoExpenseCTA;
