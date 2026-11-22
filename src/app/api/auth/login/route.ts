import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { cookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, otp } = body;

    if (!identifier || !otp) {
      return NextResponse.json(
        { message: "Username/email and verification code are required" },
        { status: 400 }
      );
    }

    const cleanIdentifier = identifier.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    await connectDb();

    const userExist = await User.findOne({
      $or: [{ username: cleanIdentifier }, { email: cleanIdentifier }],
    });

    if (!userExist) {
      return NextResponse.json(
        { message: "No account found with this email or username" },
        { status: 400 }
      );
    }

    const otpRecord = await Otp.findOne({
      email: userExist.email,
      otp: cleanOtp,
      purpose: "login",
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "Invalid verification code" },
        { status: 400 }
      );
    }

    if (otpRecord.isUsed) {
      return NextResponse.json(
        { message: "This verification code has already been used" },
        { status: 400 }
      );
    }

    const isExpired = otpRecord.expiresAt
      ? otpRecord.expiresAt < new Date()
      : Date.now() - new Date(otpRecord.createdAt).getTime() > 5 * 60 * 1000;

    if (isExpired) {
      return NextResponse.json(
        { message: "This verification code has expired" },
        { status: 400 }
      );
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const accessToken = userExist.generateAccessToken();

    const response = NextResponse.json(
      {
        message: "Login successful",
        userId: userExist._id.toString(),
        username: userExist.username,
      },
      { status: 200 }
    );

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
