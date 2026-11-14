/**
 * ============================================================================
 * ANALYTICS SERVICE (Data Aggregation for Charts & Trends)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * This service powers the Analytics page:
 * 1. Weekly Trends: Queries the last 7 days of spending, divided by category.
 * 2. Monthly Distribution: Category breakdown for the current month (Bar/Pie charts).
 * 3. Yearly Overview: Full year category breakdown.
 * 
 * All time boundaries are normalized to the user's local timezone.
 */

import { IUser } from "@/models/User";
import {
  expenseRepository,
  ExpenseCategoryBreakdown,
  DailyCategoryExpense,
} from "@/repositories/expense.repository";
import { expenseCategories } from "@/constants/expenseCategories";

export interface AnalyticsData {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  weeklyAnalytics: DailyCategoryExpense[];
  monthAnalytics: ExpenseCategoryBreakdown[];
  yearAnalytics: ExpenseCategoryBreakdown[];
  month: number;
  year: number;
}

export class AnalyticsService {
  /**
   * Fetches weekly, monthly, and yearly aggregated spending data for the Analytics view.
   */
  async getAnalyticsData(user: IUser): Promise<AnalyticsData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth(); // 0 to 11

    // Convert date boundaries according to user's timezone if available
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

    const startOfMonth = new Date(yearNum, monthNum, 1, 0, 0, 0, 0);
    const startOfNextMonth = new Date(yearNum, monthNum + 1, 1, 0, 0, 0, 0);

    const startOfYear = new Date(yearNum, 0, 1, 0, 0, 0, 0);
    const startOfNextYear = new Date(yearNum + 1, 0, 1, 0, 0, 0, 0);

    // Fetch weekly, monthly, and yearly analytics concurrently
    const [weeklyAnalytics, monthAnalytics, yearAnalytics] = await Promise.all([
      expenseRepository.getLast7DaysAnalytics(user._id, user.timezone),
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
      weeklyAnalytics,
      monthAnalytics,
      yearAnalytics,
      month: monthNum + 1,
      year: yearNum,
    };
  }

  /**
   * Returns empty analytics data with 0 amounts for logged-out or placeholder states.
   */
  getEmptyAnalyticsData(): AnalyticsData {
    const emptyCategories = expenseCategories.map((cat) => ({
      category: cat,
      totalAmount: 0,
    }));

    return {
      isLogin: false,
      user: null,
      weeklyAnalytics: [],
      monthAnalytics: emptyCategories,
      yearAnalytics: emptyCategories,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };
  }
}

export const analyticsService = new AnalyticsService();
