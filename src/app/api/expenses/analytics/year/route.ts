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
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ message: "Year is required" }, { status: 400 });
    }

    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year) + 1, 0, 1);

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
    console.error("Year Analytics Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
