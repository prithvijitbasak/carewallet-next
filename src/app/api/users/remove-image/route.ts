/**
 * ============================================================================
 * REMOVE USER AVATAR API ROUTE (`POST /api/users/remove-image`)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * What does this endpoint do?
 * Clears the user's uploaded profile avatar, setting `image: null` in MongoDB.
 * Reverts the UI back to displaying the user's initial (e.g. "P" for Prithvijit).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    if (!user.image || !user.image.data) {
      return NextResponse.json(
        {
          status: "error",
          message: "The user does not have any profile picture to remove!",
        },
        { status: 404 }
      );
    }

    // Set image to null in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { image: null } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Profile image deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error deleting image";
    return NextResponse.json(
      {
        message: "Server error while deleting image",
        error: message,
      },
      { status: 500 }
    );
  }
}
