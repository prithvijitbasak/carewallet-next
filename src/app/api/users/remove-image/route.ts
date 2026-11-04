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
          message: "The user does not have any image!",
        },
        { status: 404 }
      );
    }

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
        message: "Image deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Server error while deleting image",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
