// Expense Mongoose model and TypeScript interfaces

import mongoose, { Schema, Document, Model } from "mongoose";
import { expenseCategories, ExpenseCategory } from "@/constants/expenseCategories";

// TypeScript interface representing a single Expense document
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

// Mongoose Schema defining constraints, validations, and types for an Expense
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
