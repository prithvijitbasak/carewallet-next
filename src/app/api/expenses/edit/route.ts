// Updates an existing expense record after validating input and ownership

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";
import { validateExpense } from "@/lib/validators/expense.validator";

export async function PATCH(req: NextRequest) {
  try {
    // Step 1: Authenticate the user
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    const body = await req.json();
    const { _id, ...expenseData } = body;

    if (!_id) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense ID (_id) is required to perform an update.",
        },
        { status: 400 }
      );
    }

    // Step 2: Validate updated expense data against Zod schema
    const validationResult = validateExpense(expenseData);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed for the expense data.",
          errors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Step 3: Verify the expense belongs to the logged-in user
    const existingExpense = await Expense.findOne({ _id, user: user._id });
    if (!existingExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found or you are not authorized to update it.",
        },
        { status: 404 }
      );
    }

    const updatedData = {
      title: validationResult.data.title,
      amount: validationResult.data.amount,
      category: validationResult.data.category,
      date: new Date(validationResult.data.date),
      notes: validationResult.data.notes || "",
    };

    // Step 4: Apply update in MongoDB
    const updatedExpense = await Expense.findByIdAndUpdate(_id, updatedData, {
      new: true, // Returns the modified document rather than original
      runValidators: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Expense updated successfully.",
        updatedExpense,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error editing expense";
    console.error("Error editing expense:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
        error: message,
      },
      { status: 500 }
    );
  }
}
