import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";

// An API for providing the homepage details 
// Only fullName of the user will be provided by checking the auth token if the user is logged in 
// Then only we will need to provide that, otherwise we will not provide that 

export async function GET(req: NextRequest) {
  try {
    const { user, error } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({
        isLogin: false,
        user: null,
      });
    }

    return NextResponse.json({
      isLogin: true,
      user: {
        fullName: user.fullName,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error in SSR home API:", error);
    return NextResponse.json({
      isLogin: false,
      user: null,
    });
  }
}
