import mongoose from "mongoose";

let connectionPromise: Promise<typeof mongoose> | null = null;

async function dbConnect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  const MONGODB_URI = process.env.MONGODB_URI!;
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }
  if (!connectionPromise) {
    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
  }
  return connectionPromise;
}

export default dbConnect;
