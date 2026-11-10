import React, { Suspense } from "react";
import MonthDetailsContent from "@/components/MonthDetailsContent";
import DataTableShimmer from "@/components/shimmerUIs/DataTableShimmer";
import { ssrFetch } from "@/lib/authFetch";
import { MonthDetailsData } from "@/services/month-details.service";

export const dynamic = "force-dynamic";

interface MonthDetailsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function MonthDetailsPage({
  params,
  searchParams,
}: MonthDetailsPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const routeUsername = resolvedParams?.username;
  const monthParam = resolvedSearchParams?.month;
  const yearParam = resolvedSearchParams?.year;

  const queryParams = new URLSearchParams();
  if (monthParam) queryParams.set("month", monthParam);
  if (yearParam) queryParams.set("year", yearParam);
  queryParams.set("page", "1");
  queryParams.set("limit", "10");

  const endpoint = `/api/ssr/month-details?${queryParams.toString()}`;

  const initialData = await ssrFetch<MonthDetailsData>(endpoint, {
    requireAuth: true,
  });

  return (
    <Suspense fallback={<DataTableShimmer />}>
      <MonthDetailsContent
        initialData={initialData}
        initialMonth={monthParam}
        initialYear={yearParam}
        routeUsername={routeUsername}
      />
    </Suspense>
  );
}
