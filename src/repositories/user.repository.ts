// Data access layer for User collection queries and updates

import mongoose from "mongoose";
import connectDb from "@/lib/db";
import User, { IUser } from "@/models/User";

export class UserRepository {
  // Finds a single user document by ID, excluding sensitive fields by default
  async findById(
    id: string | mongoose.Types.ObjectId,
    projection: string = "-password -__v"
  ): Promise<IUser | null> {
    await connectDb();
    return User.findById(id).select(projection);
  }

  // Finds a user document matching an exact username
  async findByUsername(username: string): Promise<IUser | null> {
    await connectDb();
    return User.findOne({ username });
  }

  // Finds a user document matching an exact email address
  async findByEmail(email: string): Promise<IUser | null> {
    await connectDb();
    return User.findOne({ email });
  }
}

// Export a singleton instance for use across the application
export const userRepository = new UserRepository();
