// Service calculating timezone-aware date boundaries and dashboard summaries

import { IUser } from "@/models/User";
import {
  expenseRepository,
  DashboardExpenseSummary,
  ExpenseCategoryBreakdown,
} from "@/repositories/expense.repository";
import { expenseCategories } from "@/constants/expenseCategories";

export interface DashboardData extends DashboardExpenseSummary {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  fullName: string;
  username: string;
  todayExpenses: number;
  monthExpenses: number;
  yearExpenses: number;
  monthAnalytics: ExpenseCategoryBreakdown[];
  yearAnalytics: ExpenseCategoryBreakdown[];
  month: number;
  year: number;
}

export class DashboardService {
  // Computes today, month, and year boundaries and fetches dashboard metrics
  async getDashboardData(user: IUser): Promise<DashboardData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth(); // 0 to 11
    let dateNum = now.getDate();

    // Adjust calculation boundaries to the user's timezone if present
    if (user.timezone) {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: user.timezone,
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        const parts = formatter.formatToParts(now);
        const partMap: Record<string, number> = {};
        for (const p of parts) {
          if (p.type !== "literal") {
            partMap[p.type] = parseInt(p.value, 10);
          }
        }
        if (partMap.year && partMap.month && partMap.day) {
          yearNum = partMap.year;
          monthNum = partMap.month - 1; // Convert 1-based month to 0-based
          dateNum = partMap.day;
        }
      } catch {
        // Fallback to server's current date if timezone conversion fails
      }
    }

    // Define boundary timestamps for Today, This Month, and This Year
    const startOfToday = new Date(yearNum, monthNum, dateNum, 0, 0, 0, 0);
    const endOfToday = new Date(yearNum, monthNum, dateNum, 23, 59, 59, 999);

    const startOfMonth = new Date(yearNum, monthNum, 1, 0, 0, 0, 0);
    const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

    const startOfYear = new Date(yearNum, 0, 1, 0, 0, 0, 0);
    const endOfYear = new Date(yearNum, 11, 31, 23, 59, 59, 999);

    const startOfNextMonth = new Date(yearNum, monthNum + 1, 1, 0, 0, 0, 0);
    const startOfNextYear = new Date(yearNum + 1, 0, 1, 0, 0, 0, 0);

    // Run database queries concurrently using Promise.all for optimal speed
    const [summary, monthAnalytics, yearAnalytics] = await Promise.all([
      expenseRepository.getDashboardSummary(user._id, {
        startOfToday,
        endOfToday,
        startOfMonth,
        endOfMonth,
        startOfYear,
        endOfYear,
      }),
      expenseRepository.getCategoryAnalytics(
        user._id,
        startOfMonth,
        startOfNextMonth
      ),
      expenseRepository.getCategoryAnalytics(
        user._id,
        startOfYear,
        startOfNextYear
      ),
    ]);

    return {
      isLogin: true,
      user: {
        fullName: user.fullName,
        username: user.username,
      },
      fullName: user.fullName,
      username: user.username,
      totalTodayExpenses: summary.totalTodayExpenses,
      totalThisMonthExpenses: summary.totalThisMonthExpenses,
      totalThisYearExpenses: summary.totalThisYearExpenses,
      todayExpenses: summary.totalTodayExpenses,
      monthExpenses: summary.totalThisMonthExpenses,
      yearExpenses: summary.totalThisYearExpenses,
      monthAnalytics,
      yearAnalytics,
      month: monthNum + 1,
      year: yearNum,
    };
  }

  // Returns empty dashboard summary fallback with zero totals
  getEmptyDashboardData(): DashboardData {
    const emptyCategories = expenseCategories.map((cat) => ({
      category: cat,
      totalAmount: 0,
    }));

    return {
      isLogin: false,
      user: null,
      fullName: "",
      username: "",
      totalTodayExpenses: 0,
      totalThisMonthExpenses: 0,
      totalThisYearExpenses: 0,
      todayExpenses: 0,
      monthExpenses: 0,
      yearExpenses: 0,
      monthAnalytics: emptyCategories,
      yearAnalytics: emptyCategories,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
  }
}

// Singleton service instance
export const dashboardService = new DashboardService();
