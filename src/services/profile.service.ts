/**
 * ============================================================================
 * PROFILE SERVICE (User Profile & Avatar Conversion)
 * ============================================================================
 * 
 * Beginner's Guide:
 * 
 * How do user avatars work in CareWallet?
 * 1. Avatars are uploaded as raw image binary buffers into MongoDB (alongside MIME type e.g. "image/png").
 * 2. Browsers cannot directly display raw binary byte buffers in JSON.
 * 3. This service converts the binary Buffer into a standard Base64 string:
 *    `Buffer.from(...).toString("base64")`
 * 4. The client can immediately render this with:
 *    `<img src={`data:${contentType};base64,${data}`} />`
 * 5. Sensitive credentials (password hashes, database internals) are stripped before returning.
 */

import { IUser } from "@/models/User";

export interface ProfileUserData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  timezone: string;
  image: {
    data: string;
    contentType: string;
  } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileData {
  isLogin: boolean;
  user: ProfileUserData | null;
}

export class ProfileService {
  /**
   * Sanitizes the user document, converts binary profile pictures to Base64,
   * and prepares profile data for the user settings page.
   */
  async getProfileData(user: IUser): Promise<ProfileData> {
    const rawUser = user.toObject ? user.toObject() : { ...user };

    let image = null;
    if (rawUser.image && rawUser.image.data) {
      if (Buffer.isBuffer(rawUser.image.data)) {
        image = {
          data: rawUser.image.data.toString("base64"),
          contentType: rawUser.image.contentType,
        };
      } else if (rawUser.image.data.data) {
        image = {
          data: Buffer.from(rawUser.image.data.data).toString("base64"),
          contentType: rawUser.image.contentType,
        };
      } else if (typeof rawUser.image.data === "string") {
        image = {
          data: rawUser.image.data,
          contentType: rawUser.image.contentType,
        };
      }
    }

    return {
      isLogin: true,
      user: {
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "Normal user",
        timezone: user.timezone || "UTC",
        image,
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : undefined,
        updatedAt: user.updatedAt ? new Date(user.updatedAt).toISOString() : undefined,
      },
    };
  }

  getEmptyProfileData(): ProfileData {
    return {
      isLogin: false,
      user: null,
    };
  }
}

export const profileService = new ProfileService();
