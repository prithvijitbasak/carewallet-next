import { IUser } from "@/models/User";
import { expenseRepository } from "@/repositories/expense.repository";
import monthData from "@/data/monthData.json";

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
  expenses: any[];
}

export interface MonthDetailsQueryOptions {
  monthParam?: string;
  yearParam?: string;
  pageParam?: string;
  limitParam?: string;
}

export class MonthDetailsService {
  async getMonthDetailsData(
    user: IUser,
    options: MonthDetailsQueryOptions = {}
  ): Promise<MonthDetailsData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth(); // 0 to 11

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
        // Fallback
      }
    }

    const defaultMonth = String(monthNum + 1).padStart(2, "0");
    const defaultYear = String(yearNum);

    const m = options.monthParam ? parseInt(options.monthParam, 10) : monthNum + 1;
    const y = options.yearParam ? parseInt(options.yearParam, 10) : yearNum;
    const page = Math.max(1, parseInt(options.pageParam || "1", 10) || 1);
    const limit = Math.max(1, parseInt(options.limitParam || "10", 10) || 10);

    const startDate = new Date(y, m - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(y, m, 0, 23, 59, 59, 999);

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
      expenses: result.expenses,
    };
  }

  getEmptyMonthDetailsData(): MonthDetailsData {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());
    const formattedMonthLabel =
      (monthData as Record<string, string>)[month] || month;

    return {
      isLogin: false,
      user: null,
      month,
      year,
      formattedMonthLabel,
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
