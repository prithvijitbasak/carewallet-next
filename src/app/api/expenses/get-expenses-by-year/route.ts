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
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ error: "Missing year parameter" }, { status: 400 });
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1000 || yearNum > 9999) {
      return NextResponse.json({ error: "Invalid year format" }, { status: 400 });
    }

    const startDate = new Date(yearNum, 0, 1);
    const endDate = new Date(yearNum, 11, 31, 23, 59, 59, 999);

    const aggregation = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          month: "$_id.month",
          totalAmount: 1,
          _id: 0,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    const monthlyExpenses: Record<string, number> = {};
    for (let month = 1; month <= 12; month++) {
      const monthFormatted = month.toString().padStart(2, "0");
      monthlyExpenses[monthFormatted] = 0;
    }

    aggregation.forEach((item) => {
      const monthFormatted = item.month.toString().padStart(2, "0");
      monthlyExpenses[monthFormatted] = item.totalAmount;
    });

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte: startDate, $lte: endDate },
    })
      .select("_id title amount category date notes createdAt updatedAt")
      .sort({ date: 1 });

    const totalExpenses = aggregation.reduce(
      (sum, item) => sum + item.totalAmount,
      0
    );

    return NextResponse.json({
      totalExpenses,
      monthlyExpenses,
      expenses,
    });
  } catch (err) {
    console.error("Error fetching yearly expenses:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
