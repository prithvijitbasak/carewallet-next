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

    const today = new Date();
    const tz = user.timezone || "UTC";

    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setHours(23, 59, 59, 999);

    const analytics = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(user._id),
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

    const finalData: any[] = [];
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

      const dayEntry: Record<string, any> = {
        date: dateKey,
        day: dayName,
      };

      categories.forEach((cat) => {
        dayEntry[cat] = resultMap[dateKey]?.[cat] || 0;
      });

      finalData.push(dayEntry);
    }

    return NextResponse.json(finalData, { status: 200 });
  } catch (err) {
    console.error("Last 7 Days Analytics Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
