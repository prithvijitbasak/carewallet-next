/**
 * ============================================================================
 * USER REPOSITORY (Data Access Layer)
 * ============================================================================
 * 
 * Beginner's Guide to the Repository Pattern:
 * 
 * In clean software architecture, we avoid scattering raw database queries across
 * our entire application. Instead, we isolate all database interactions into "Repositories".
 * 
 * Advantages:
 * 1. Single Responsibility: Only repositories talk directly to Mongoose and MongoDB.
 * 2. Reusability: Common queries like `findById` or `findByUsername` are written once.
 * 3. Maintainability: If database schema or queries change, only this file needs editing.
 */

import mongoose from "mongoose";
import connectDb from "@/lib/db";
import User, { IUser } from "@/models/User";

export class UserRepository {
  /**
   * Finds a single user document by its MongoDB ObjectId.
   * By default, strips sensitive fields (`password` and `__v`).
   * 
   * @param id - User's MongoDB ObjectId or hexadecimal string
   * @param projection - Fields to include/exclude (defaults to excluding password)
   */
  async findById(
    id: string | mongoose.Types.ObjectId,
    projection: string = "-password -__v"
  ): Promise<IUser | null> {
    await connectDb();
    return User.findById(id).select(projection);
  }

  /**
   * Finds a user document matching an exact username.
   */
  async findByUsername(username: string): Promise<IUser | null> {
    await connectDb();
    return User.findOne({ username });
  }

  /**
   * Finds a user document matching an exact email address.
   */
  async findByEmail(email: string): Promise<IUser | null> {
    await connectDb();
    return User.findOne({ email });
  }
}

// Export a singleton instance for use across the application
export const userRepository = new UserRepository();
