/**
 * ============================================================================
 * EXPENSES API ROUTE (`POST /api/expenses`)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * What does this endpoint do?
 * Handles batch creation of expenses. A user can submit a single expense or an
 * entire array of expenses from the "Add Expenses" page.
 * 
 * Workflow:
 * 1. Authentication: Extracts and verifies JWT from cookie/header.
 * 2. Normalization: If a single object was sent, wraps it in an array `[body]`.
 * 3. Validation: Validates every item with Zod `validateExpense()`.
 *    - Valid items are collected into `validExpenses`.
 *    - Invalid items are collected into `invalidExpenses` with detailed error notes.
 * 4. Batch Insertion: `Expense.insertMany(validExpenses)` inserts all valid items
 *    in a single, fast database transaction.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense, { IExpense } from "@/models/Expense";
import { validateExpense } from "@/lib/validators/expense.validator";
import mongoose from "mongoose";

interface PreparedExpense {
  user: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: IExpense["category"];
  date: Date;
  notes: string;
}

interface FailedExpense {
  expense: unknown;
  errors: unknown;
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Verify authenticated user session
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    // Step 2: Read payload (supports single object or array)
    let expenses = await req.json();

    if (!Array.isArray(expenses)) {
      expenses = [expenses];
    }

    const validExpenses: PreparedExpense[] = [];
    const invalidExpenses: FailedExpense[] = [];

    // Step 3: Validate each expense item independently
    expenses.forEach((expense: unknown) => {
      const validationResult = validateExpense(expense);
      if (validationResult.success) {
        validExpenses.push({
          user: user._id,
          title: validationResult.data.title,
          amount: validationResult.data.amount,
          category: validationResult.data.category,
          date: new Date(validationResult.data.date),
          notes: validationResult.data.notes || "",
        });
      } else {
        invalidExpenses.push({
          expense,
          errors: validationResult.error.format(),
        });
      }
    });

    // Step 4: Insert valid items in a single batch operation
    let insertedExpenses: unknown[] = [];
    if (validExpenses.length > 0) {
      insertedExpenses = await Expense.insertMany(validExpenses);
    }

    // Step 5: Respond with detailed status
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
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Error adding expenses:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
