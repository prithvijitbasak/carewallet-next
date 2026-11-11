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
  async getProfileData(user: IUser): Promise<ProfileData> {
    const userObj: any = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    delete userObj._id;
    delete userObj.__v;

    let image = null;
    if (userObj.image && userObj.image.data) {
      if (Buffer.isBuffer(userObj.image.data)) {
        image = {
          data: userObj.image.data.toString("base64"),
          contentType: userObj.image.contentType,
        };
      } else if (userObj.image.data.data) {
        image = {
          data: Buffer.from(userObj.image.data.data).toString("base64"),
          contentType: userObj.image.contentType,
        };
      } else if (typeof userObj.image.data === "string") {
        image = {
          data: userObj.image.data,
          contentType: userObj.image.contentType,
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
        createdAt: user.createdAt
          ? new Date(user.createdAt).toISOString()
          : undefined,
        updatedAt: user.updatedAt
          ? new Date(user.updatedAt).toISOString()
          : undefined,
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
