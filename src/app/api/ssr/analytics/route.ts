import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { analyticsService } from "@/services/analytics.service";

// An API for providing SSR analytics page details:
// - isLogin
// - user (fullName, username)
// - weeklyAnalytics
// - monthAnalytics
// - yearAnalytics
// - month
// - year

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(analyticsService.getEmptyAnalyticsData());
    }

    const data = await analyticsService.getAnalyticsData(user);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in SSR analytics API:", error);
    return NextResponse.json(analyticsService.getEmptyAnalyticsData());
  }
}
