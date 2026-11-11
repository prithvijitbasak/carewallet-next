import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { expenseRepository } from "@/repositories/expense.repository";

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

    const result = await expenseRepository.getCategoryAnalytics(
      user._id,
      startDate,
      endDate
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Month Analytics Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
