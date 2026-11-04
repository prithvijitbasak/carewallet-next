import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAuthenticatedUser } from "@/lib/auth";
import Expense from "@/models/Expense";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "Unauthorized" }, { status });
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }

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

    await existingExpense.deleteOne();

    return NextResponse.json(
      { message: "Expense deleted successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: "Failed to delete expense",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
