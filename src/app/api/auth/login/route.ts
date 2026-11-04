import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators/auth.validator";
import { cookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
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

    const isPasswordMatch = await userExist.comparePassword(password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 400 }
      );
    }

    const accessToken = userExist.generateAccessToken();
    const refreshToken = userExist.generateRefreshToken();

    userExist.refreshToken = refreshToken;
    await userExist.save();

    const response = NextResponse.json(
      {
        message: "Login successful",
        userId: userExist._id.toString(),
        username: userExist.username,
      },
      { status: 201 }
    );

    response.cookies.set(cookieOptions.accessToken.name, accessToken, cookieOptions.accessToken);
    response.cookies.set(cookieOptions.refreshToken.name, refreshToken, cookieOptions.refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
