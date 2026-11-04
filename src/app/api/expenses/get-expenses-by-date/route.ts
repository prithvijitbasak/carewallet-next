import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ error: error || "Unauthorized" }, { status });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    const dateParts = date.split("-");
    if (dateParts.length !== 3) {
      return NextResponse.json(
        { error: "Invalid date format. Use DD-MM-YYYY" },
        { status: 400 }
      );
    }

    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const startDate = new Date(formattedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedDate);
    endDate.setHours(23, 59, 59, 999);

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte: startDate, $lte: endDate },
    }).select("_id title amount category date notes createdAt updatedAt");

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return NextResponse.json({
      totalExpenses,
      expenses,
    });
  } catch (err) {
    console.error("Error fetching expenses by date:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
