"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

interface ExpenseSearchBoxProps {
  searchType: "date" | "month";
}

const ExpenseSearchBox: React.FC<ExpenseSearchBoxProps> = ({ searchType }) => {
  const [rawDate, setRawDate] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [inputMonth, setInputMonth] = useState("");
  const [inputYear, setInputYear] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  const handleDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const collectedDate = e.target.value;
    setRawDate(collectedDate);

    if (collectedDate) {
      const [year, month, day] = collectedDate.split("-");
      const formatted = `${day}-${month}-${year}`;
      setFormattedDate(formatted);
    }
  };

  const handleMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const collectedMonth = e.target.value;
    if (collectedMonth) {
      const [year, month] = collectedMonth.split("-");
      setInputMonth(month);
      setInputYear(year);
    }
  };

  const handleSearch = () => {
    if (!user) return;
    if (formattedDate || (inputMonth && inputYear)) {
      if (searchType === "month") {
        router.push(
          `/${user.username}/month-details?month=${inputMonth}&year=${inputYear}`
        );
      } else {
        router.push(`/${user.username}/day-details?date=${formattedDate}`);
      }
    } else {
      toast.error("Please select a date!");
    }
  };

  return (
    <div className="px-6 py-5 bg-white shadow-md rounded-xl border border-gray-100 min-w-[280px]">
      <p className="font-semibold text-center pb-4 text-gray-800">
        {searchType === "month" ? "Search By Month" : "Search By Date"}
      </p>
      {searchType === "month" ? (
        <input
          type="month"
          onChange={handleMonth}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4caf50] outline-none"
        />
      ) : (
        <input
          type="date"
          onChange={handleDate}
          value={rawDate}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#4caf50] outline-none"
        />
      )}
      <div className="text-center">
        <button
          onClick={handleSearch}
          className="mt-4 bg-[#4caf50] hover:bg-[#43a047] text-white font-medium py-2 px-6 rounded-lg cursor-pointer transition-colors shadow-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ExpenseSearchBox;
