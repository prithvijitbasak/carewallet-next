/**
 * ============================================================================
 * EXPENSE REPOSITORY (Data Access Layer for Expenses)
 * ============================================================================
 * 
 * Beginner's Guide to MongoDB Aggregations:
 * 
 * When dealing with financial data, fetching thousands of expense records into
 * Node.js memory to sum them up with JavaScript `reduce()` can be extremely slow and memory-intensive.
 * 
 * Instead, we use MongoDB's native "Aggregation Pipeline".
 * Think of an aggregation pipeline as a factory assembly line:
 * 1. `$match`: Filters the documents (like a WHERE clause in SQL).
 * 2. `$group`: Groups matching documents together and calculates mathematical sums (`$sum`).
 * 3. `$cond`: Evaluates an IF/THEN/ELSE condition directly inside the database.
 * 4. `$project`: Shapes the final output keys and values.
 * 5. `$sort`: Sorts records (e.g. newest first).
 */

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

export interface DailyCategoryExpense {
  date: string;
  day: string;
  [category: string]: string | number;
}

export class ExpenseRepository {
  /**
   * Computes today's, this month's, and this year's total expenses in a SINGLE database query
   * using conditional summation inside a MongoDB aggregation pipeline.
   */
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
      // Step 1: Match expenses for this user within the current calendar year
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startOfYear, $lte: endOfYear },
        },
      },
      // Step 2: Sum amounts conditionally into today, month, and year totals
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

  /**
   * Aggregates total expense amounts per category within a specific date range.
   * Ensures all categories from `expenseCategories` are present in the returned list (defaulting to 0).
   */
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

    // Ensure every category exists in the response array even if spent amount is 0
    return expenseCategories.map((cat) => {
      const found = aggregation.find((a) => a.category === cat);
      return {
        category: cat,
        totalAmount: found ? found.totalAmount : 0,
      };
    });
  }

  /**
   * Retrieves the most recent expenses for a user.
   * Uses `.lean()` for better read performance (returns plain JS objects instead of Mongoose Documents).
   */
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

  /**
   * Calculates category breakdown for the last 7 calendar days.
   * Groups results by day string and category, formatted according to user timezone.
   */
  async getLast7DaysAnalytics(
    userId: string | mongoose.Types.ObjectId,
    timezone?: string
  ): Promise<DailyCategoryExpense[]> {
    await connectDb();

    const today = new Date();
    const tz = timezone || "UTC";

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const analytics = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            dateStr: {
              $dateToString: {
                format: "%d-%m-%Y",
                date: "$date",
                timezone: tz,
              },
            },
            category: "$category",
          },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const resultMap: Record<string, Record<string, number>> = {};
    analytics.forEach((item) => {
      const { dateStr, category } = item._id;
      if (!resultMap[dateStr]) resultMap[dateStr] = {};
      resultMap[dateStr][category] = item.totalAmount;
    });

    const finalData: DailyCategoryExpense[] = [];
    const categories = expenseCategories;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      const dateKey = `${day}-${month}-${year}`;

      let dayName = "";
      try {
        dayName = d.toLocaleDateString("en-US", {
          weekday: "short",
          timeZone: tz,
        });
      } catch {
        dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      }

      const dayEntry: DailyCategoryExpense = {
        date: dateKey,
        day: dayName,
      };

      categories.forEach((cat) => {
        dayEntry[cat] = resultMap[dateKey]?.[cat] || 0;
      });

      finalData.push(dayEntry);
    }

    return finalData;
  }

  /**
   * Generates a paginated report of expenses between two dates with grand total.
   */
  async getDateRangeReport(
    userId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10
  ) {
    await connectDb();

    const skip = (page - 1) * limit;
    const matchQuery = {
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate },
    };

    // Run count/sum aggregation and document retrieval in parallel for speed
    const [totalStats, expenses] = await Promise.all([
      Expense.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
            totalCount: { $sum: 1 },
          },
        },
      ]),
      Expense.find(matchQuery)
        .select("_id title amount category date notes createdAt updatedAt")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalAmount = totalStats.length > 0 ? totalStats[0].totalAmount : 0;
    const totalRecords = totalStats.length > 0 ? totalStats[0].totalCount : 0;

    return {
      totalAmount: totalAmount.toFixed(2),
      pagination: {
        totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit) || 1,
        limit,
      },
      expenses,
    };
  }

  /**
   * Retrieves all expenses for a specific single day.
   */
  async getExpensesByDate(
    userId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date
  ) {
    await connectDb();

    const query = {
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate },
    };

    const expenses = await Expense.find(query)
      .select("_id title amount category date notes createdAt updatedAt")
      .sort({ date: -1, createdAt: -1 })
      .lean();

    const totalExpenses = Number(
      expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0).toFixed(2)
    );

    return {
      totalExpenses,
      expenses,
    };
  }

  /**
   * Retrieves paginated expenses for an entire month with total month sum.
   */
  async getExpensesByMonth(
    userId: string | mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    page: number = 1,
    limit: number = 10
  ) {
    await connectDb();

    const pageNum = Math.max(1, page);
    const limitNum = Math.max(1, limit);
    const skip = (pageNum - 1) * limitNum;

    const baseQuery = {
      user: new mongoose.Types.ObjectId(userId),
      date: { $gte: startDate, $lte: endDate },
    };

    const [totalRecords, totalExpenseAggregation, expenses] = await Promise.all([
      Expense.countDocuments(baseQuery),
      Expense.aggregate([
        { $match: baseQuery },
        { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
      ]),
      Expense.find(baseQuery)
        .select("_id title amount category date notes createdAt updatedAt")
        .sort({ date: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
    ]);

    const totalExpenses = Number(
      (totalExpenseAggregation[0]?.totalAmount ?? 0).toFixed(2)
    );
    const totalPages = Math.max(1, Math.ceil(totalRecords / limitNum));

    return {
      totalExpenses,
      totalRecords,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      expenses,
    };
  }
}

// Singleton repository instance
export const expenseRepository = new ExpenseRepository();
