// User Mongoose model with password hashing and verification

import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// TypeScript interface defining all fields and methods on a User document
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  image?: {
    data: Buffer;
    contentType: string;
  } | null;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string; // Stored as a one-way bcrypt hash (never plain-text)
  role: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;

  // Custom helper methods added to the User model
  generateAccessToken(): string;
  comparePassword(password: string): Promise<boolean>;
}

// Mongoose Schema describing the structure and rules of the users collection
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
      unique: true, // Guarantees no two users share the same username
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // Guarantees no two users share the same email
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
  },
  {
    // Automatically creates and manages `createdAt` and `updatedAt` Date fields
    timestamps: true,
  }
);

// Generates a signed 30-day JWT containing the user ID
UserSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    {
      userId: this._id.toString(),
    },
    process.env.JWT_ACCESS_KEY as string,
    { expiresIn: "30d" }
  );
};

// Compares a candidate plain-text password with the stored bcrypt hash
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Next.js hot-reloads modules, so reuse existing model if compiled, or create a new one
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
