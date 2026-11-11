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
    const startDateParam = searchParams.get("startDateParam");
    const endDateParam = searchParams.get("endDateParam");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    if (!startDateParam || !endDateParam) {
      return NextResponse.json(
        { error: "Missing date parameters" },
        { status: 400 }
      );
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const startDateParts = startDateParam.split("-");
    const endDateParts = endDateParam.split("-");

    const formattedStartDate = `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`;
    const formattedEndDate = `${endDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`;

    const startDate = new Date(formattedStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(formattedEndDate);
    endDate.setHours(23, 59, 59, 999);

    const result = await expenseRepository.getDateRangeReport(
      user._id,
      startDate,
      endDate,
      pageNum,
      limitNum
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching report expenses:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
