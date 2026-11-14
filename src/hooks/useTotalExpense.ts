// Custom hook for fetching total expenses across day, month, or year timeframes

"use client";

import { useState, useEffect } from "react";

export interface ExpenseValues {
  date?: string;
  month?: string;
  year?: string | number;
}

export interface UseTotalExpenseOptions {
  enabled?: boolean;
}

const useTotalExpense = (
  type: "day" | "month" | "year",
  values: ExpenseValues = {},
  options: UseTotalExpenseOptions = { enabled: true }
) => {
  const isEnabled = options.enabled !== false;
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(isEnabled);

  const { date, month, year } = values;

  useEffect(() => {
    // If the hook is disabled (e.g. modal is closed or inputs are missing), don't fetch
    if (!isEnabled) {
      setLoading(false);
      setError(null);
      return;
    }

    // Build the corresponding API endpoint according to the requested timeframe
    const buildURL = () => {
      if (type === "day" && date) {
        return `/api/expenses/get-expenses-by-date?date=${encodeURIComponent(date)}`;
      }
      if (type === "month" && month && year) {
        return `/api/expenses/get-expenses-by-month?month=${encodeURIComponent(month)}&year=${encodeURIComponent(year.toString())}`;
      }
      if (type === "year" && year) {
        return `/api/expenses/get-expenses-by-year?year=${encodeURIComponent(year.toString())}`;
      }
      return null;
    };

    const fetchTotal = async () => {
      const url = buildURL();
      if (!url) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(url, {
          method: "GET",
          credentials: "include", // Attach cookies for session verification
        });

        if (!res.ok) {
          throw new Error("Failed to fetch total expense");
        }

        const data = await res.json();
        setTotal(data.totalExpenses || 0);
        setError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to fetch total expense";
        setError(message);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [type, date, month, year, isEnabled]);

  return { total, loading, error };
};

export default useTotalExpense;
