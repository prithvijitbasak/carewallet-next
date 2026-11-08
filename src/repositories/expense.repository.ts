import mongoose from "mongoose";
import connectDb from "@/lib/db";
import Expense from "@/models/Expense";

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
}

export const expenseRepository = new ExpenseRepository();
