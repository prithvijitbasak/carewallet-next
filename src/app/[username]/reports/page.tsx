/**
 * ============================================================================
 * REPORTS PAGE (`/[username]/reports`)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * Server Component that initializes the financial reports interface:
 * 1. Resolves dynamic route parameters (`await params`).
 * 2. Fetches default report data on the server via `ssrFetch<ReportsData>`.
 * 3. Renders the interactive `<ReportsContent />` client component, which lets
 *    users change date ranges, paginate results, and download PDF reports.
 */

import React from "react";
import ReportsContent from "@/components/reports/ReportsContent";
import { ssrFetch } from "@/lib/authFetch";
import { ReportsData } from "@/services/reports.service";

export const dynamic = "force-dynamic";

interface ReportsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  // Await dynamic route parameter in Next.js 16
  await params;

  // Server-side prefetch of initial report data
  const data = await ssrFetch<ReportsData>("/api/ssr/reports", {
    requireAuth: true,
  });

  return <ReportsContent initialData={data} />;
}
