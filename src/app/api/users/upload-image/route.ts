import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No image file provided!" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Not an image! Please upload only images." },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        image: {
          data: buffer,
          contentType: file.type,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Image uploaded successfully!",
        image: {
          data: buffer.toString("base64"),
          contentType: file.type,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Server error while uploading image!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
