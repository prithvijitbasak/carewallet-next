"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

function YearDetailsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentYear = new Date().getFullYear();
  const year = searchParams.get("year") || String(currentYear);

  const monthArray: { name: string; index: number }[] = [];
  for (let month = 0; month < 12; month++) {
    const dateInMonth = new Date(Number(year), month, 2);
    const monthName = dateInMonth.toLocaleString("default", { month: "long" });
    monthArray.push({ name: monthName, index: month });
  }

  const [monthlyExpenses, setMonthlyExpenses] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(
          `/api/expenses/get-expenses-by-year?year=${year}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setMonthlyExpenses(data.monthlyExpenses || {});
        } else {
          setMonthlyExpenses({});
        }
      } catch (error) {
        console.error("Error while fetching expenses:", error);
        setMonthlyExpenses({});
      }
    };

    fetchExpenses();
  }, [year]);

  return (
    <div className="py-6 max-w-7xl mx-auto px-4">
      <section className="year-wrapper mb-8">
        <div className="text-center">
          <h2 className="year font-bold text-3xl text-gray-800">
            Year - {year}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Click on any month to view details
          </p>
        </div>
      </section>

      <section className="months-wrapper">
        <div className="month-grid">
          {monthArray.map((monthData) => {
            const monthFormatted = (monthData.index + 1)
              .toString()
              .padStart(2, "0");

            return (
              <Link
                href={`/${user?.username}/month-details?month=${monthFormatted}&year=${year}`}
                key={monthData.index}
                className="hover:scale-[1.02] transition-transform duration-200"
              >
                <div className="month-link flex flex-col justify-center items-center h-full">
                  <p className="text-2xl font-bold pb-2 text-white">
                    {monthData.name}
                  </p>
                  <p className="text-white text-base font-medium opacity-90">
                    Total ={" "}
                    {monthlyExpenses[monthFormatted] !== undefined
                      ? `₹${monthlyExpenses[monthFormatted]}`
                      : "Loading..."}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default function YearDetailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading year details...</div>}>
      <YearDetailsContent />
    </Suspense>
  );
}
