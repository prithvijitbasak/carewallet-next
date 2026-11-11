import { z } from "zod";
import { expenseCategories } from "@/constants/expenseCategories";

export const parseDate = (val: unknown): unknown => {
  if (typeof val !== "string") return val;

  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
  const match = val.match(dateRegex);

  if (!match) return NaN;

  const [, day, month, year] = match.map(Number);
  return new Date(year, month - 1, day);
};

export const expenseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  amount: z.number().min(0, "Amount cannot be negative"),
  category: z.enum(expenseCategories),
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

export const validateExpense = (expenseData: unknown) => {
  return expenseSchema.safeParse(expenseData);
};

export type ExpenseInput = z.infer<typeof expenseSchema>;
