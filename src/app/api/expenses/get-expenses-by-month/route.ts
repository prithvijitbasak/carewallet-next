import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { expenseRepository } from "@/repositories/expense.repository";

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
    const limit = searchParams.get("limit") || "10";

    if (!month || !year) {
      return NextResponse.json(
        { error: "Missing month or year parameter" },
        { status: 400 }
      );
    }

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: "Invalid month or year format" },
        { status: 400 }
      );
    }

    const startDate = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    const result = await expenseRepository.getExpensesByMonth(
      user._id,
      startDate,
      endDate,
      pageNum,
      limitNum
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching expenses by month:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
