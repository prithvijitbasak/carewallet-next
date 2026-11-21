import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { cookieOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const clientId =
      process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET || process.env.NEXT_PUBLIC_GOOGLE_SECRET;
    const redirectUri = `${req.nextUrl.origin}/api/auth/callback/google`;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId || "",
        client_secret: clientSecret || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    await connectDb();

    let user = await User.findOne({
      $or: [{ googleId: googleUser.id }, { email: googleUser.email }],
    });

    if (!user) {
      const emailPrefix = googleUser.email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      let username = emailPrefix || "user";
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${emailPrefix}${counter}`;
        counter++;
      }

      user = await User.create({
        fullName: googleUser.name || "Google User",
        username: username,
        email: googleUser.email,
        googleId: googleUser.id,
        timezone: "UTC",
        role: "Normal user",
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleUser.id;
        await user.save();
      }
    }

    const accessToken = user.generateAccessToken();

    const response = NextResponse.redirect(
      new URL(`/${user.username}`, req.url)
    );

    response.cookies.set(
      cookieOptions.accessToken.name,
      accessToken,
      cookieOptions.accessToken
    );

    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
