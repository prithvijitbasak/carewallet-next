import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { expenseRepository } from "@/repositories/expense.repository";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    const finalData = await expenseRepository.getLast7DaysAnalytics(
      user._id,
      user.timezone
    );

    return NextResponse.json(finalData, { status: 200 });
  } catch (err) {
    console.error("Last 7 Days Analytics Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
