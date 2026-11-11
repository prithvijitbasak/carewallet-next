import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { dashboardService } from "@/services/dashboard.service";

// An API for providing SSR dashboard details:
// - fullName
// - total today expenses
// - total this month expenses
// - total this year expenses

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(dashboardService.getEmptyDashboardData());
    }

    const dashboardData = await dashboardService.getDashboardData(user);
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error in SSR dashboard API:", error);
    return NextResponse.json(dashboardService.getEmptyDashboardData());
  }
}
