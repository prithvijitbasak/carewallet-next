// Fetches the authenticated user profile with base64 image serialization

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    const rawUser = user.toObject();
    
    // Construct sanitized profile response
    let base64ImageData: string | null = null;
    if (rawUser.image && rawUser.image.data) {
      if (Buffer.isBuffer(rawUser.image.data)) {
        base64ImageData = rawUser.image.data.toString("base64");
      } else if (rawUser.image.data.data) {
        base64ImageData = Buffer.from(rawUser.image.data.data).toString("base64");
      }
    }

    const userProfile = {
      fullName: rawUser.fullName,
      username: rawUser.username,
      email: rawUser.email,
      phone: rawUser.phone,
      role: rawUser.role,
      timezone: rawUser.timezone,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
      image: base64ImageData
        ? {
            data: base64ImageData,
            contentType: rawUser.image?.contentType || "image/png",
          }
        : null,
    };

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
