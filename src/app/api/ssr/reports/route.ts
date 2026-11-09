import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { reportsService } from "@/services/reports.service";

// An API for providing SSR reports page details:
// - isLogin
// - user (fullName, username)
// - year
// - startDate
// - endDate
// - totalAmount
// - pagination
// - expenses

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(reportsService.getEmptyReportsData());
    }

    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const data = await reportsService.getReportsData(user, {
      startDateParam: startDateParam || undefined,
      endDateParam: endDateParam || undefined,
      pageParam: pageParam || undefined,
      limitParam: limitParam || undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in SSR reports API:", error);
    return NextResponse.json(reportsService.getEmptyReportsData());
  }
}
