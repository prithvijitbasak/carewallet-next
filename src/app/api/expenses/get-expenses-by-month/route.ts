import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "7";

    if (!month || !year) {
      return NextResponse.json(
        { error: "Missing month or year parameter" },
        { status: 400 }
      );
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 7);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: "Invalid month or year format" },
        { status: 400 }
      );
    }

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const baseQuery = {
      user: new mongoose.Types.ObjectId(user._id),
      date: { $gte: startDate, $lte: endDate },
    };

    const totalRecords = await Expense.countDocuments(baseQuery);

    const totalExpenseAggregation = await Expense.aggregate([
      { $match: baseQuery },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } },
    ]);

    const totalExpenses = Number(
      (totalExpenseAggregation[0]?.totalAmount ?? 0).toFixed(2)
    );

    const expenses = await Expense.find(baseQuery)
      .select("_id title amount category date notes createdAt updatedAt")
      .sort({ date: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const totalPages = Math.max(1, Math.ceil(totalRecords / limitNum));

    return NextResponse.json({
      totalExpenses,
      totalRecords,
      totalPages,
      currentPage: pageNum,
      expenses,
    });
  } catch (err) {
    console.error("Error fetching expenses by month:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
