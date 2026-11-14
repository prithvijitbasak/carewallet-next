// Service managing profile data formatting, image base64 conversion, and updates

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
  // Sanitizes user document and converts binary profile picture to base64
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
