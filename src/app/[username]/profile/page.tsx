import React from "react";
import ProfileContent from "@/components/ProfileContent";
import { ssrFetch } from "@/lib/authFetch";
import { ProfileData } from "@/services/profile.service";

export const dynamic = "force-dynamic";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params;
  const routeUsername = resolvedParams?.username;

  const initialData = await ssrFetch<ProfileData>("/api/ssr/profile", {
    requireAuth: true,
  });

  return (
    <ProfileContent
      initialData={initialData}
      routeUsername={routeUsername}
    />
  );
}
