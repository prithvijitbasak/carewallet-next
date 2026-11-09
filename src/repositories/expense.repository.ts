import mongoose from "mongoose";
import connectDb from "@/lib/db";
import Expense from "@/models/Expense";
import { expenseCategories } from "@/constants/expenseCategories";

export interface ExpenseCategoryBreakdown {
  category: string;
  totalAmount: number;
}

export interface DashboardExpenseSummary {
  totalTodayExpenses: number;
  totalThisMonthExpenses: number;
  totalThisYearExpenses: number;
}

export interface DateRanges {
  startOfToday: Date;
  endOfToday: Date;
  startOfMonth: Date;
  endOfMonth: Date;
  startOfYear: Date;
  endOfYear: Date;
}

export class ExpenseRepository {
  async getDashboardSummary(
    userId: string | mongoose.Types.ObjectId,
    dateRanges: DateRanges
  ): Promise<DashboardExpenseSummary> {
    await connectDb();

    const {
      startOfToday,
      endOfToday,
      startOfMonth,
      endOfMonth,
      startOfYear,
      endOfYear,
    } = dateRanges;

    const aggregation = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      {
        $group: {
          _id: null,
          totalThisYearExpenses: { $sum: "$amount" },
          totalThisMonthExpenses: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$date", startOfMonth] },
                    { $lte: ["$date", endOfMonth] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
          totalTodayExpenses: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$date", startOfToday] },
                    { $lte: ["$date", endOfToday] },
                  ],
                },
                "$amount",
                0,
              ],
            },
          },
        },
      },
    ]);

    const totalTodayExpenses = Number(
      (aggregation[0]?.totalTodayExpenses ?? 0).toFixed(2)
    );
    const totalThisMonthExpenses = Number(
      (aggregation[0]?.totalThisMonthExpenses ?? 0).toFixed(2)
    );
    const totalThisYearExpenses = Number(
      (aggregation[0]?.totalThisYearExpenses ?? 0).toFixed(2)
    );

    return {
      totalTodayExpenses,
      totalThisMonthExpenses,
      totalThisYearExpenses,
    };
  }

  async getCategoryAnalytics(
    userId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<ExpenseCategoryBreakdown[]> {
    await connectDb();

    const aggregation = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalAmount: 1,
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
    ]);

    return expenseCategories.map((cat) => {
      const found = aggregation.find((a) => a.category === cat);
      return {
        category: cat,
        totalAmount: found ? found.totalAmount : 0,
      };
    });
  }

  async getRecentExpenses(
    userId: string | mongoose.Types.ObjectId,
    limit: number = 5
  ) {
    await connectDb();

    return Expense.find({ user: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }
}

export const expenseRepository = new ExpenseRepository();
