import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";
import { updateUserSchema } from "@/lib/validators/user.validator";

export async function PUT(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    const body = await req.json();
    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const { fullName, username, email, phone } = validation.data;
    const updates: Record<string, string> = {};

    if (fullName) updates.fullName = fullName;
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (phone) updates.phone = phone;

    const userId = user._id;

    if (username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return NextResponse.json(
          { message: "Username already taken" },
          { status: 400 }
        );
      }
    }

    if (email) {
      const existingEmail = await User.findOne({
        email,
        _id: { $ne: userId },
      });
      if (existingEmail) {
        return NextResponse.json(
          { message: "Email already registered" },
          { status: 400 }
        );
      }
    }

    if (phone) {
      const existingPhone = await User.findOne({
        phone,
        _id: { $ne: userId },
      });
      if (existingPhone) {
        return NextResponse.json(
          { message: "Phone number already registered" },
          { status: 400 }
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Server error while updating user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
