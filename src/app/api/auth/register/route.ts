// Handles user registration, password hashing, validation, and auto-login

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { signupSchema } from "@/lib/validators/auth.validator";
import { isValidTimezone } from "@/lib/timezone";
import { cookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Step 1: Validate payload against Zod schema
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Validation error",
          errors: validation.error.format(),
        },
        { status: 400 }
      );
    }

    const { fullName, username, email, phone, password, role, timezone } =
      validation.data;

    await connectDb();

    // Step 2: Ensure username, email, and phone number are unique
    const userExist = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (userExist) {
      if (userExist.username === username) {
        return NextResponse.json(
          { message: "This username already exists" },
          { status: 400 }
        );
      }
      if (userExist.email === email) {
        return NextResponse.json(
          { message: "This email is already registered" },
          { status: 400 }
        );
      }
      if (userExist.phone === phone) {
        return NextResponse.json(
          { message: "This phone number is already used" },
          { status: 400 }
        );
      }
    }

    // Step 3: Validate timezone string
    const valid = await isValidTimezone(timezone);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid or unsupported timezone selected" },
        { status: 400 }
      );
    }

    // Step 4: Hash password with bcrypt (10 salt rounds)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Save new User record into MongoDB
    const userCreated = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      timezone,
    });

    // Step 6: Generate JWT access token
    const accessToken = userCreated.generateAccessToken();

    const response = NextResponse.json(
      {
        message: "Registration successful",
        userId: userCreated._id.toString(),
        username: userCreated.username,
      },
      { status: 201 }
    );

    // Set secure HttpOnly cookie so the user is logged in
    response.cookies.set(
      cookieOptions.accessToken.name,
      accessToken,
      cookieOptions.accessToken
    );

    return response;
  } catch (error: unknown) {
    console.error("Error in registration:", error);
    return NextResponse.json(
      { message: "Server error, please try again later." },
      { status: 500 }
    );
  }
}
