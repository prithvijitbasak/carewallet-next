import React from "react";
import AddExpense from "@/components/AddExpense";
import { ssrFetch } from "@/lib/authFetch";
import { AddExpenseData } from "@/services/add-expense.service";

export const dynamic = "force-dynamic";

interface AddExpensePageProps {
  params: Promise<{ username: string }>;
}

export default async function AddExpensePage({ params }: AddExpensePageProps) {
  const resolvedParams = await params;
  const routeUsername = resolvedParams?.username;

  const data = await ssrFetch<AddExpenseData>("/api/ssr/add-expense", {
    requireAuth: true,
  });

  const categories = data?.categories ?? [];
  const defaultDate = data?.defaultDate ?? "";

  return (
    <div className="py-6">
      <AddExpense
        initialCategories={categories}
        defaultDate={defaultDate}
      />
    </div>
  );
}
