/**
 * ============================================================================
 * EXPENSE VALIDATOR (Zod Schema)
 * ============================================================================
 * 
 * Why do we use Zod?
 * Zod is a TypeScript-first schema declaration and validation library.
 * Instead of writing dozens of manual `if (!req.body.title) ...` statements,
 * we define a strict blueprint for our data.
 * 
 * Key features demonstrated here:
 * 1. String trimming & constraints: .trim().min(1).max(200)
 * 2. Preprocessing: converting human strings like "15-08-2026" (DD-MM-YYYY) into JavaScript Date objects.
 * 3. Type inference: `z.infer<typeof expenseSchema>` automatically gives us a TypeScript type!
 */

import { z } from "zod";
import { expenseCategories } from "@/constants/expenseCategories";

/**
 * Custom parser that converts a "DD-MM-YYYY" string into a valid JavaScript Date object.
 * Returns NaN if string format does not match.
 */
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

/**
 * Zod validation schema for creating or updating an expense.
 */
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

/**
 * Validates arbitrary input against the expenseSchema safely without throwing exceptions.
 * 
 * @param expenseData - The raw payload to validate
 * @returns Zod SafeParseReturnType containing either `.data` (if valid) or `.error` (if invalid).
 */
export const validateExpense = (expenseData: unknown) => {
  return expenseSchema.safeParse(expenseData);
};

// TypeScript type automatically extracted from the Zod schema
export type ExpenseInput = z.infer<typeof expenseSchema>;
