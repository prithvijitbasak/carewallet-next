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
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json({ message: "Year is required" }, { status: 400 });
    }

    const startDate = new Date(Number(year), 0, 1);
    const endDate = new Date(Number(year) + 1, 0, 1);

    const result = await expenseRepository.getCategoryAnalytics(
      user._id,
      startDate,
      endDate
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Year Analytics Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
