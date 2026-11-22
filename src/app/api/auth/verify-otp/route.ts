import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { cookieOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, fullName, username, timezone } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    await connectDb();

    const otpRecord = await Otp.findOne({
      email: cleanEmail,
      otp: cleanOtp,
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

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      if (!fullName || !username) {
        return NextResponse.json(
          { message: "Full name and username are required for new accounts" },
          { status: 400 }
        );
      }

      const cleanUsername = username.toLowerCase().trim();

      const existingUsername = await User.findOne({ username: cleanUsername });
      if (existingUsername) {
        return NextResponse.json(
          { message: "This username already exists" },
          { status: 400 }
        );
      }

      user = await User.create({
        fullName: fullName.trim(),
        username: cleanUsername,
        email: cleanEmail,
        role: "Normal user",
        timezone: timezone || "UTC",
      });
    }

    otpRecord.isUsed = true;
    await otpRecord.save();

    const accessToken = user.generateAccessToken();

    const response = NextResponse.json(
      {
        message: "Authentication successful",
        userId: user._id.toString(),
        username: user.username,
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
    console.error("Auth verification error:", error);
    return NextResponse.json(
      { message: "Server error, please try again later." },
      { status: 500 }
    );
  }
}
