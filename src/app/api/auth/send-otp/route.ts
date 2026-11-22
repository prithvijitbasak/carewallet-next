import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/Otp";
import { sendOtpEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Please provide an email address" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    await connectDb();

    const existingUser = await User.findOne({ email: cleanEmail });
    const isExistingUser = Boolean(existingUser);
    const purpose = isExistingUser ? "login" : "register";

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await Otp.create({
      email: cleanEmail,
      otp,
      purpose,
      isUsed: false,
      expiresAt,
      createdAt: new Date(),
    });

    await sendOtpEmail(cleanEmail, otp, purpose);

    return NextResponse.json(
      {
        message: "Verification code sent to your email",
        email: cleanEmail,
        isExistingUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return NextResponse.json(
      { message: "Failed to send verification code. Please try again." },
      { status: 500 }
    );
  }
}
