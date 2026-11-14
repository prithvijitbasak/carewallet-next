/**
 * ============================================================================
 * DATABASE CONNECTION UTILITY (MongoDB + Mongoose)
 * ============================================================================
 * 
 * Why does this file exist?
 * Next.js runs in a "serverless" and hot-reloading environment during development.
 * If we simply called `mongoose.connect()` every time a request arrived, Next.js
 * would open dozens of new database connections, exhausting MongoDB's connection pool.
 *
 * How this solution works:
 * We cache the active Mongoose connection in NodeJS's `global` object.
 * 1. If a connection already exists in `global`, we reuse it immediately.
 * 2. If a connection is in the middle of connecting, we wait for that existing Promise.
 * 3. Only if no connection exists do we initiate a new connection to MongoDB.
 */

import mongoose from "mongoose";

// Read the connection string from environment variables (.env.local)
const MONGODB_URI = process.env.DB_KEY || "";

if (!MONGODB_URI) {
  console.warn(
    "⚠️ Warning: DB_KEY is not defined in .env.local! Database queries will fail."
  );
}

/**
 * Shape of our global connection cache.
 * - conn: The active, established Mongoose connection (or null if not yet connected)
 * - promise: The pending Promise while connecting is in progress
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend NodeJS global type to include our mongooseCache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Check if we already have a cached connection in `global`, or initialize a fresh one
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect to the MongoDB database using Mongoose.
 * 
 * @returns A promise that resolves to the Mongoose instance.
 * @example
 * ```ts
 * import connectDb from "@/lib/db";
 * 
 * export async function GET() {
 *   await connectDb();
 *   // Now you can safely use Mongoose models!
 * }
 * ```
 */
export async function connectDb(): Promise<typeof mongoose> {
  // Step 1: Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Step 2: If no connection attempt is in flight, start connecting
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if commands are executed before connection
      dbName: "carewallet",  // Target database name
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // Step 3: Await the connection promise and save the connection to cache
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    // If the connection failed, reset the promise so next request can retry
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDb;
