/**
 * ============================================================================
 * DELETE EXPENSE API ROUTE (`DELETE /api/expenses/[id]`)
 * ============================================================================
 * 
 * Beginner's Guide to Secure Deletions:
 * 
 * Security Rule: IDOR Prevention (Insecure Direct Object Reference)
 * Notice that we do NOT simply run `Expense.findByIdAndDelete(id)`.
 * If we did, any logged-in user could delete ANY other user's expense simply by
 * guessing or knowing the ID!
 * 
 * Instead, we query:
 * `Expense.findOne({ _id: id, user: user._id })`
 * This guarantees that an expense can ONLY be deleted if it was created by
 * the currently authenticated user!
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Step 1: Authenticate the user
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    // Step 2: Extract dynamic route ID
    const { id } = await params;

    // Step 3: Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid expense ID format" }, { status: 400 });
    }

    // Step 4: Verify that the expense belongs to the logged-in user
    const existingExpense = await Expense.findOne({ _id: id, user: user._id });

    if (!existingExpense) {
      return NextResponse.json(
        {
          success: false,
          message: "Expense not found or you are not authorized to delete it.",
        },
        { status: 404 }
      );
    }

    // Step 5: Delete document
    await existingExpense.deleteOne();

    return NextResponse.json(
      { message: "Expense deleted successfully!" },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Deletion error";
    return NextResponse.json(
      {
        message: "Failed to delete expense",
        error: message,
      },
      { status: 500 }
    );
  }
}
