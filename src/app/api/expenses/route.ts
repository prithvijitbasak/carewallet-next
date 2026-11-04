import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";
import { validateExpense } from "@/lib/validators/expense.validator";

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    let expenses = await req.json();

    if (!Array.isArray(expenses)) {
      expenses = [expenses];
    }

    const validExpenses: any[] = [];
    const invalidExpenses: any[] = [];

    expenses.forEach((expense: any) => {
      const validationResult = validateExpense(expense);
      if (validationResult.success) {
        validExpenses.push({
          user: user._id,
          title: validationResult.data.title,
          amount: validationResult.data.amount,
          category: validationResult.data.category,
          date: new Date(validationResult.data.date as any),
          notes: validationResult.data.notes || "",
        });
      } else {
        invalidExpenses.push({
          expense,
          errors: validationResult.error.format(),
        });
      }
    });

    let insertedExpenses: any[] = [];
    if (validExpenses.length > 0) {
      insertedExpenses = await Expense.insertMany(validExpenses);
    }

    return NextResponse.json(
      {
        success: invalidExpenses.length === 0,
        message:
          invalidExpenses.length > 0
            ? "Some expenses were not added due to validation errors"
            : "Expenses added successfully",
        addedExpenses: insertedExpenses,
        failedExpenses: invalidExpenses,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error adding expenses:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
