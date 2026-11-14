/**
 * ============================================================================
 * ADD EXPENSE PAGE (`/[username]/add-expense`)
 * ============================================================================
 * 
 * Beginner's Guide to Next.js 16 Server Components:
 * 
 * 1. Server Component:
 *    This page is an `async` function running on the server.
 *    It pre-fetches category definitions and the default local date via `ssrFetch`.
 * 
 * 2. Asynchronous Route Parameters:
 *    In Next.js 15 and 16, route parameters (`params`) are delivered as a Promise:
 *    `const resolvedParams = await params;`
 * 
 * 3. Client Component Handoff:
 *    Once the server fetches `categories` and `defaultDate`, it passes them as props
 *    into `<AddExpense />`, a Client Component ("use client") that handles user interactions.
 */

import React from "react";
import AddExpense from "@/components/AddExpense";
import { ssrFetch } from "@/lib/authFetch";
import { AddExpenseData } from "@/services/add-expense.service";

export const dynamic = "force-dynamic";

interface AddExpensePageProps {
  params: Promise<{ username: string }>;
}

export default async function AddExpensePage({ params }: AddExpensePageProps) {
  // Await route parameter in Next.js 16
  await params;

  // Server-side prefetch of category list and current date
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
