import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { monthDetailsService } from "@/services/month-details.service";

// An API for providing SSR month-details page details:
// - isLogin
// - user (fullName, username)
// - month
// - year
// - formattedMonthLabel
// - previousMonth
// - previousYear
// - nextMonth
// - nextYear
// - totalExpenses
// - totalRecords
// - totalPages
// - currentPage
// - limit
// - expenses

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(monthDetailsService.getEmptyMonthDetailsData());
    }

    const { searchParams } = new URL(req.url);
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const data = await monthDetailsService.getMonthDetailsData(user, {
      monthParam: monthParam || undefined,
      yearParam: yearParam || undefined,
      pageParam: pageParam || undefined,
      limitParam: limitParam || undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in SSR month-details API:", error);
    return NextResponse.json(monthDetailsService.getEmptyMonthDetailsData());
  }
}
