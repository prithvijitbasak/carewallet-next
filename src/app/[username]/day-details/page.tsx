import React, { Suspense } from "react";
import DayDetailsContent from "@/components/DayDetailsContent";
import DataTableShimmer from "@/components/shimmerUIs/DataTableShimmer";
import { ssrFetch } from "@/lib/authFetch";
import { DayDetailsData } from "@/services/day-details.service";

export const dynamic = "force-dynamic";

interface DayDetailsPageProps {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ date?: string }>;
}

export default async function DayDetailsPage({
  params,
  searchParams,
}: DayDetailsPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const routeUsername = resolvedParams?.username;
  const dateParam = resolvedSearchParams?.date;

  const endpoint = dateParam
    ? `/api/ssr/day-details?date=${encodeURIComponent(dateParam)}`
    : "/api/ssr/day-details";

  const initialData = await ssrFetch<DayDetailsData>(endpoint, {
    requireAuth: true,
  });

  return (
    <Suspense fallback={<DataTableShimmer />}>
      <DayDetailsContent
        initialData={initialData}
        initialDate={dateParam}
        routeUsername={routeUsername}
      />
    </Suspense>
  );
}
