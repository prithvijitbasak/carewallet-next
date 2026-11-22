import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/db";
import User from "@/models/User";
import { cookieOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/?auth=true", req.url));
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
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
      return NextResponse.redirect(new URL("/?auth=true", req.url));
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
      return NextResponse.redirect(new URL("/?auth=true", req.url));
    }

    await connectDb();

    const cleanEmail = googleUser.email.toLowerCase().trim();

    let user = await User.findOne({ email: cleanEmail });

    if (!user) {
      const emailPrefix = cleanEmail.split("@")[0];
      let username = emailPrefix;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${emailPrefix}${counter}`;
        counter++;
      }

      user = await User.create({
        fullName: googleUser.name || "Google User",
        username: username,
        email: cleanEmail,
        timezone: "UTC",
        role: "Normal user",
      });
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
  } catch {
    return NextResponse.redirect(new URL("/?auth=true", req.url));
  }
}
