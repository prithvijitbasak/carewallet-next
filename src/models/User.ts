import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  image?: {
    data: Buffer;
    contentType: String;
  } | null;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  timezone: string;
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    image: {
      data: Buffer,
      contentType: String,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "Normal user",
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
    },
    process.env.JWT_ACCESS_KEY as string,
    { expiresIn: "6h" }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
    },
    process.env.JWT_REFRESH_KEY as string,
    { expiresIn: "7d" }
  );
};

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
