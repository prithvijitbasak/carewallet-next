import mongoose from "mongoose";
import connectDb from "@/lib/db";
import User, { IUser } from "@/models/User";

export class UserRepository {
  async findById(
    id: string | mongoose.Types.ObjectId,
    projection: string = "-password -__v"
  ): Promise<IUser | null> {
    await connectDb();
    return User.findById(id).select(projection);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    await connectDb();
    return User.findOne({ username });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    await connectDb();
    return User.findOne({ email });
  }
}

export const userRepository = new UserRepository();
