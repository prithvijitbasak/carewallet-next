export const expenseCategories = [
  "Savings",
  "Food",
  "Transport",
  "Grocery",
  "Bill",
  "Medicine",
  "Shopping",
  "Entertainment",
  "Investment",
  "Other",
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];
