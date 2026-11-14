// Server component page for generating and exporting expense reports and PDFs

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
