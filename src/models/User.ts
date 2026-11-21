import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  image?: {
    data: Buffer;
    contentType: string;
  } | null;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  role: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;

  generateAccessToken(): string;
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
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      default: "Normal user",
    },
    timezone: {
      type: String,
      default: "UTC",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      userId: this._id.toString(),
    },
    process.env.JWT_ACCESS_KEY as string,
    { expiresIn: "30d" }
  );
};

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(password, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
