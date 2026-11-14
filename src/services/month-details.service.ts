/**
 * ============================================================================
 * MONTH DETAILS SERVICE (Monthly Paginated Expense Inspector)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * What does this service do?
 * When viewing the "Month Details" page:
 * 1. Derives the target month (1-12) and year (e.g. 2026), defaulting to current local time.
 * 2. Determines the exact start timestamp (`new Date(y, m - 1, 1, 0, 0, 0, 0)`)
 *    and end timestamp (`new Date(y, m, 0, 23, 59, 59, 999)`).
 * 3. Computes the previous month/year and next month/year for month navigation arrows.
 * 4. Queries paginated records with total pages and sum from the ExpenseRepository.
 */

import { IUser } from "@/models/User";
import { expenseRepository } from "@/repositories/expense.repository";
import monthData from "@/data/monthData.json";
import { ExpenseRecord } from "./day-details.service";

export interface MonthDetailsData {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  month: string;
  year: string;
  formattedMonthLabel: string;
  previousMonth: string;
  previousYear: string;
  nextMonth: string;
  nextYear: string;
  totalExpenses: number;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  expenses: ExpenseRecord[];
}

export interface MonthDetailsQueryOptions {
  monthParam?: string;
  yearParam?: string;
  pageParam?: string;
  limitParam?: string;
}

export class MonthDetailsService {
  /**
   * Retrieves paginated expenses for an entire month along with navigation month/year strings.
   */
  async getMonthDetailsData(
    user: IUser,
    options: MonthDetailsQueryOptions = {}
  ): Promise<MonthDetailsData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth(); // 0 to 11

    // Convert to user's local timezone if available
    if (user.timezone) {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: user.timezone,
          year: "numeric",
          month: "numeric",
        });
        const parts = formatter.formatToParts(now);
        const partMap: Record<string, number> = {};
        for (const p of parts) {
          if (p.type !== "literal") {
            partMap[p.type] = parseInt(p.value, 10);
          }
        }
        if (partMap.year && partMap.month) {
          yearNum = partMap.year;
          monthNum = partMap.month - 1;
        }
      } catch {
        // Fallback to server date
      }
    }

    const m = options.monthParam ? parseInt(options.monthParam, 10) : monthNum + 1;
    const y = options.yearParam ? parseInt(options.yearParam, 10) : yearNum;
    const page = Math.max(1, parseInt(options.pageParam || "1", 10) || 1);
    const limit = Math.max(1, parseInt(options.limitParam || "10", 10) || 10);

    // Month boundary: day 1 of month m to day 0 of month m+1 (which is the last day of month m)
    const startDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

    // Previous and Next month calculations for UI pagination controls
    const currentMonthDate = new Date(y, m - 1, 1);
    const prevMonthDate = new Date(currentMonthDate);
    prevMonthDate.setMonth(currentMonthDate.getMonth() - 1);
    const nextMonthDate = new Date(currentMonthDate);
    nextMonthDate.setMonth(currentMonthDate.getMonth() + 1);

    const previousMonth = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
    const previousYear = String(prevMonthDate.getFullYear());
    const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, "0");
    const nextYear = String(nextMonthDate.getFullYear());

    const monthStr = String(m).padStart(2, "0");
    const yearStr = String(y);
    const formattedMonthLabel =
      (monthData as Record<string, string>)[monthStr] || monthStr;

    const result = await expenseRepository.getExpensesByMonth(
      user._id,
      startDate,
      endDate,
      page,
      limit
    );

    return {
      isLogin: true,
      user: {
        fullName: user.fullName,
        username: user.username,
      },
      month: monthStr,
      year: yearStr,
      formattedMonthLabel,
      previousMonth,
      previousYear,
      nextMonth,
      nextYear,
      totalExpenses: result.totalExpenses,
      totalRecords: result.totalRecords,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: result.limit,
      expenses: result.expenses as unknown as ExpenseRecord[],
    };
  }

  getEmptyMonthDetailsData(): MonthDetailsData {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
    const currentYear = String(now.getFullYear());

    return {
      isLogin: false,
      user: null,
      month: currentMonth,
      year: currentYear,
      formattedMonthLabel:
        (monthData as Record<string, string>)[currentMonth] || currentMonth,
      previousMonth: "",
      previousYear: "",
      nextMonth: "",
      nextYear: "",
      totalExpenses: 0,
      totalRecords: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      expenses: [],
    };
  }
}

export const monthDetailsService = new MonthDetailsService();
