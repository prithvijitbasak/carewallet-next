// Database connection utility with cached Mongoose instance for serverless environments

import mongoose from "mongoose";

// Read the connection string from environment variables (.env.local)
const MONGODB_URI = process.env.DB_KEY || "";

if (!MONGODB_URI) {
  console.warn(
    "⚠️ Warning: DB_KEY is not defined in .env.local! Database queries will fail."
  );
}

// Cached connection and in-flight promise for Mongoose
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

// Connects to MongoDB using cached connection or initiates a new connection
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
