/**
 * ============================================================================
 * EXPENSE MODEL (Mongoose Schema & Types)
 * ============================================================================
 * 
 * What is this file for?
 * This defines how an individual "Expense" document is represented in MongoDB.
 * 
 * Key Concepts for Beginners:
 * 1. Relationships (Foreign Keys in MongoDB):
 *    The `user` field contains a MongoDB ObjectId referencing the `User` model.
 *    This ensures every single expense belongs to exactly one user.
 * 2. Indexes:
 *    The `user: { index: true }` option adds a database index on the `user` field,
 *    enabling fast queries when filtering expenses by user ID.
 * 3. Enums:
 *    The `category` field only allows values defined in `expenseCategories` array.
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import { expenseCategories, ExpenseCategory } from "@/constants/expenseCategories";

/**
 * TypeScript interface representing a single Expense document.
 */
export interface IExpense extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose Schema defining constraints, validations, and types for an Expense.
 */
const ExpenseSchema = new Schema<IExpense>(
  {
    // The user who created/owns this expense
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "An expense must be associated with a user"],
      index: true, // Speeds up queries searching by user
    },
    // Brief title or description, e.g. "Grocery Shopping"
    title: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
    },
    // Cost in currency units, e.g. 45.50
    amount: {
      type: Number,
      required: [true, "Expense amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    // Category selected from pre-defined allowed list
    category: {
      type: String,
      enum: expenseCategories,
      required: [true, "Expense category is required"],
      trim: true,
    },
    // The date when the expense occurred (not necessarily the moment it was logged)
    date: {
      type: Date,
      required: [true, "Expense date is required"],
    },
    // Optional additional notes
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    // Automatically creates `createdAt` and `updatedAt` timestamps
    timestamps: true,
  }
);

// Reuse existing compiled model if present (Next.js hot reload), or compile a new one
const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
