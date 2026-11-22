import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}
