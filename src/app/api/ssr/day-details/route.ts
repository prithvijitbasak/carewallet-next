import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { dayDetailsService } from "@/services/day-details.service";

// An API for providing SSR day-details page details:
// - isLogin
// - user (fullName, username)
// - date
// - formattedDate
// - previousDate
// - nextDate
// - totalExpenses
// - expenses

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(dayDetailsService.getEmptyDayDetailsData());
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date");

    const data = await dayDetailsService.getDayDetailsData(user, {
      dateParam: dateParam || undefined,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in SSR day-details API:", error);
    return NextResponse.json(dayDetailsService.getEmptyDayDetailsData());
  }
}
