"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Calendar, CalendarDays } from "lucide-react";
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

  const isMonth = searchType === "month";

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
      toast.error(
        isMonth ? "Please select a month and year!" : "Please select a date!"
      );
    }
  };

  return (
    <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#4caf50]/10 text-[#4caf50] flex items-center justify-center">
            {isMonth ? (
              <CalendarDays className="w-4 h-4" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800">
              {isMonth ? "Lookup by Month" : "Lookup by Date"}
            </h4>
            <p className="text-xs text-gray-500">
              {isMonth
                ? "Filter expenses across an entire month"
                : "View expenses for an exact calendar day"}
            </p>
          </div>
        </div>

        <div className="mt-4">
          {isMonth ? (
            <input
              type="month"
              onChange={handleMonth}
              className="w-full px-3.5 py-2.5 bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20 outline-none transition-all shadow-sm"
            />
          ) : (
            <input
              type="date"
              onChange={handleDate}
              value={rawDate}
              className="w-full px-3.5 py-2.5 bg-white text-gray-800 text-sm rounded-xl border border-gray-200 focus:border-[#4caf50] focus:ring-2 focus:ring-[#4caf50]/20 outline-none transition-all shadow-sm"
            />
          )}
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={handleSearch}
          className="w-full inline-flex items-center justify-center gap-2 bg-[#4caf50] hover:bg-[#43a047] active:scale-[0.99] text-white font-semibold py-2.5 px-4 rounded-xl cursor-pointer transition-all shadow-sm shadow-[#4caf50]/20 hover:shadow-md text-sm"
        >
          <Search className="w-4 h-4" />
          <span>{isMonth ? "Search Month" : "Search Date"}</span>
        </button>
      </div>
    </div>
  );
};

export default ExpenseSearchBox;
