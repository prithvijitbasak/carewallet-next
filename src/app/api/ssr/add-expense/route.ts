import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { addExpenseService } from "@/services/add-expense.service";

// An API for providing SSR add expense page details:
// - isLogin
// - user (fullName, username)
// - categories
// - defaultDate (in user's timezone)
// - recentExpenses

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(addExpenseService.getEmptyAddExpenseData());
    }

    const addExpenseData = await addExpenseService.getAddExpenseData(user);
    return NextResponse.json(addExpenseData);
  } catch (error) {
    console.error("Error in SSR add-expense API:", error);
    return NextResponse.json(addExpenseService.getEmptyAddExpenseData());
  }
}
