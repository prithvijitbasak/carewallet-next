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

    // 1. Check for existing user
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

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Check timezone validity
    const valid = await isValidTimezone(timezone);
    if (!valid) {
      return NextResponse.json(
        { message: "Invalid or unsupported timezone selected" },
        { status: 400 }
      );
    }

    // 4. Create user
    const userCreated = await User.create({
      fullName,
      username,
      email,
      phone,
      password: hashedPassword,
      role,
      timezone,
    });

    // 5. Generate tokens
    const refreshToken = userCreated.generateRefreshToken();
    const accessToken = userCreated.generateAccessToken();

    userCreated.refreshToken = refreshToken;
    await userCreated.save();

    const response = NextResponse.json(
      {
        message: "Registration successful",
        userId: userCreated._id.toString(),
        username: userCreated.username,
      },
      { status: 201 }
    );

    // Set cookies
    response.cookies.set(cookieOptions.accessToken.name, accessToken, cookieOptions.accessToken);
    response.cookies.set(cookieOptions.refreshToken.name, refreshToken, cookieOptions.refreshToken);

    return response;
  } catch (error: any) {
    console.error("Error in register:", error);
    return NextResponse.json(
      { message: "Server error, please try again later." },
      { status: 500 }
    );
  }
}
