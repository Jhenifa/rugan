import mongoose from "mongoose";

const globalMongoose = globalThis;

if (!globalMongoose.__ruganMongoose) {
  globalMongoose.__ruganMongoose = {
    conn: null,
    promise: null,
    warnedMissingUri: false,
  };
}

const cached = globalMongoose.__ruganMongoose;

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    if (!cached.warnedMissingUri) {
      console.warn(
        "MONGODB_URI is not configured. Continuing without database access.",
      );
      cached.warnedMissingUri = true;
    }
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI)
      .then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        console.warn("Continuing without database. Some features may not work.");
        cached.promise = null;
        return null;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
