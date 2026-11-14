// Zod validation schemas for expense creation, editing, and date parsing

import { z } from "zod";
import { expenseCategories } from "@/constants/expenseCategories";

// Converts a DD-MM-YYYY string into a valid JavaScript Date object
export const parseDate = (val: unknown): unknown => {
  if (typeof val !== "string") return val;

  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = val.match(dateRegex);

  if (!match) return NaN;

  // Destructure captured groups: [fullMatch, day, month, year]
  const [, day, month, year] = match.map(Number);
  // Note: JavaScript Date month is 0-indexed (January is 0, August is 7)
  return new Date(year, month - 1, day);
};

// Zod validation schema for creating or updating an expense
export const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),

  amount: z
    .number()
    .min(0, "Amount cannot be negative"),

  category: z.enum(expenseCategories, {
    message: "Invalid expense category",
  }),

  // Preprocess input string into Date and check if valid
  date: z.preprocess(
    parseDate,
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format. Expected dd-mm-yyyy",
    })
  ),

  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional(),
});

// Safely validates arbitrary expense input against expenseSchema
export const validateExpense = (expenseData: unknown) => {
  return expenseSchema.safeParse(expenseData);
};

// TypeScript type automatically extracted from the Zod schema
export type ExpenseInput = z.infer<typeof expenseSchema>;
