"use client";

import { useState, useEffect } from "react";

export interface ExpenseValues {
  date?: string;
  month?: string;
  year?: string | number;
}

const useTotalExpense = (type: "day" | "month" | "year", values: ExpenseValues = {}) => {
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const buildURL = () => {
      if (type === "day" && values.date) {
        return `/api/expenses/get-expenses-by-date?date=${values.date}`;
      }
      if (type === "month" && values.month && values.year) {
        return `/api/expenses/get-expenses-by-month?month=${values.month}&year=${values.year}`;
      }
      if (type === "year" && values.year) {
        return `/api/expenses/get-expenses-by-year?year=${values.year}`;
      }
      return null;
    };

    const fetchTotal = async () => {
      const url = buildURL();
      if (!url) {
        setError("Missing required parameters.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch total expense");
        }

        const data = await res.json();
        setTotal(data.totalExpenses || 0);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to fetch total expense");
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [type, JSON.stringify(values)]);

  return { total, loading, error };
};

export default useTotalExpense;
