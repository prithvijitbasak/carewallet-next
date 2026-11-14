/**
 * ============================================================================
 * UPDATE USER PROFILE API ROUTE (`PUT /api/users/update`)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * When updating user account details:
 * 1. Partial updates: The user might only edit their email or username.
 * 2. Uniqueness Conflict Prevention:
 *    If the user changes their username to "john", we check if another user already
 *    has that username (`_id: { $ne: userId }` - "not equal to current user").
 *    This allows the user to submit their own existing username without collision errors!
 * 3. Security:
 *    The returned updated user record always excludes the password hash (`.select("-password")`).
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";
import { updateUserSchema } from "@/lib/validators/user.validator";

export async function PUT(req: NextRequest) {
  try {
    // Step 1: Verify authenticated user session
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    // Step 2: Validate input fields
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

    // Step 3: Check that new username/email/phone isn't already taken by another account
    if (username) {
      const existingUsername = await User.findOne({
        username,
        _id: { $ne: userId },
      });
      if (existingUsername) {
        return NextResponse.json(
          { message: "Username already taken by another user" },
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
          { message: "Email already registered to another user" },
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
          { message: "Phone number already registered to another user" },
          { status: 400 }
        );
      }
    }

    // Step 4: Update document in MongoDB and return updated record
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error updating user";
    return NextResponse.json(
      {
        message: "Server error while updating user",
        error: message,
      },
      { status: 500 }
    );
  }
}
