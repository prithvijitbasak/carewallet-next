/**
 * ============================================================================
 * UPLOAD USER AVATAR API ROUTE (`POST /api/users/upload-image`)
 * ============================================================================
 * 
 * Beginner's Guide to Handling File Uploads in Next.js:
 * 
 * 1. FormData:
 *    Instead of sending JSON, file uploads use `multipart/form-data`.
 *    Next.js provides `await req.formData()` to parse multipart bodies natively.
 * 
 * 2. File Validation:
 *    - MIME Type Check: Ensures `file.type.startsWith("image/")` to prevent uploading malicious scripts.
 *    - File Size Limit: Caps uploads at 5MB (`5 * 1024 * 1024` bytes) to prevent database bloat.
 * 
 * 3. Buffer Conversion:
 *    `file.arrayBuffer()` converts web stream bytes into an ArrayBuffer, which is
 *    then converted to a Node.js `Buffer.from(arrayBuffer)` and stored directly in MongoDB.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Verify user authentication
    const { user, error, status } = await getAuthenticatedUser(req);

    if (error || !user) {
      return NextResponse.json({ message: error || "User not found" }, { status });
    }

    // Step 2: Extract uploaded file from multipart/form-data
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No image file provided!" },
        { status: 400 }
      );
    }

    // Step 3: Validate file type (must be an image)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Not an image! Please upload only image files (PNG, JPG, WEBP, etc.)." },
        { status: 400 }
      );
    }

    // Step 4: Validate file size (max 5 Megabytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Step 5: Convert web File into Node.js binary Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 6: Update user document in MongoDB
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

    // Step 7: Return base64 image representation for immediate UI display
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Upload error";
    return NextResponse.json(
      {
        message: "Server error while uploading image!",
        error: message,
      },
      { status: 500 }
    );
  }
}
