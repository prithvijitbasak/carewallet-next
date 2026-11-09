import React from "react";
import ReportsContent from "@/components/reports/ReportsContent";
import { ssrFetch } from "@/lib/authFetch";
import { ReportsData } from "@/services/reports.service";

export const dynamic = "force-dynamic";

interface ReportsPageProps {
  params: Promise<{ username: string }>;
}

export default async function ReportsPage({ params }: ReportsPageProps) {
  const resolvedParams = await params;
  const routeUsername = resolvedParams?.username;

  const data = await ssrFetch<ReportsData>("/api/ssr/reports", {
    requireAuth: true,
  });

  return <ReportsContent initialData={data} />;
}
