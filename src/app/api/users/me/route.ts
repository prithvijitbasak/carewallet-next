import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    const userProfile: any = user.toObject();
    delete userProfile._id;
    delete userProfile.password;
    delete userProfile.refreshToken;

    if (userProfile.image && userProfile.image.data) {
      // If it's a Buffer, serialize to base64
      if (Buffer.isBuffer(userProfile.image.data)) {
        userProfile.image.data = userProfile.image.data.toString("base64");
      } else if (userProfile.image.data.data) {
        userProfile.image.data = Buffer.from(userProfile.image.data.data).toString("base64");
      }
    }

    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
