import { IUser } from "@/models/User";
import {
  expenseRepository,
  ExpenseCategoryBreakdown,
} from "@/repositories/expense.repository";
import { expenseCategories } from "@/constants/expenseCategories";

export interface AnalyticsData {
  isLogin: boolean;
  user: {
    fullName: string;
    username: string;
  } | null;
  weeklyAnalytics: any[];
  monthAnalytics: ExpenseCategoryBreakdown[];
  yearAnalytics: ExpenseCategoryBreakdown[];
  month: number;
  year: number;
}

export class AnalyticsService {
  async getAnalyticsData(user: IUser): Promise<AnalyticsData> {
    const now = new Date();
    let yearNum = now.getFullYear();
    let monthNum = now.getMonth(); // 0 to 11
    let dateNum = now.getDate();

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
          monthNum = partMap.month - 1;
          dateNum = partMap.day;
        }
      } catch {
        // Fallback to server date
      }
    }

    const startOfMonth = new Date(yearNum, monthNum, 1, 0, 0, 0, 0);
    const startOfNextMonth = new Date(yearNum, monthNum + 1, 1, 0, 0, 0, 0);

    const startOfYear = new Date(yearNum, 0, 1, 0, 0, 0, 0);
    const startOfNextYear = new Date(yearNum + 1, 0, 1, 0, 0, 0, 0);

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
