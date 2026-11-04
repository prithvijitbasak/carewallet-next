import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";
import { expenseCategories } from "@/constants/expenseCategories";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    if (!month || !year) {
      return NextResponse.json(
        { message: "Month and year are required" },
        { status: 400 }
      );
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    const startDate = new Date(yearNum, monthNum - 1, 1);
    const endDate = new Date(yearNum, monthNum, 1);

    const analytics = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
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

    const result = expenseCategories.map((cat) => {
      const found = analytics.find((a) => a.category === cat);
      return {
        category: cat,
        totalAmount: found ? found.totalAmount : 0,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Month Analytics Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
