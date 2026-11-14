// Handles user login, password verification, and JWT session cookie issuance

import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators/auth.validator";
import { cookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Step 1: Validate request body against Zod loginSchema
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;

    await connectDb();

    // Step 2: Search for user by username, email, or phone
    const userExist = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier },
        { phone: identifier },
      ],
    });

    if (!userExist) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Step 3: Compare candidate password with the stored bcrypt hash
    const isPasswordMatch = await userExist.comparePassword(password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 }
      );
    }

    // Step 4: Generate a 30-day JWT access token
    const accessToken = userExist.generateAccessToken();

    const response = NextResponse.json(
      {
        message: "Login successful",
        userId: userExist._id.toString(),
        username: userExist.username,
      },
      { status: 201 }
    );

    // Step 5: Save token in HttpOnly cookie
    response.cookies.set(
      cookieOptions.accessToken.name,
      accessToken,
      cookieOptions.accessToken
    );

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
