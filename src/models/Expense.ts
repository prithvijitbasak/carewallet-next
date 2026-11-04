import mongoose, { Schema, Document, Model } from "mongoose";
import { expenseCategories, ExpenseCategory } from "@/constants/expenseCategories";

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

const ExpenseSchema = new Schema<IExpense>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      enum: expenseCategories,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);

export default Expense;
