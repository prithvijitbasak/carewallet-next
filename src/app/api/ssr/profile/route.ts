import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { profileService } from "@/services/profile.service";

// An API for providing SSR profile page details:
// - isLogin
// - user (fullName, username, email, phone, role, timezone, image, createdAt, updatedAt)

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json(profileService.getEmptyProfileData());
    }

    const data = await profileService.getProfileData(user);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in SSR profile API:", error);
    return NextResponse.json(profileService.getEmptyProfileData());
  }
}
