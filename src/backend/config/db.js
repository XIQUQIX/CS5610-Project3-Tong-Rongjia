import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");

    return client.db(process.env.DB_NAME);
  } catch (err) {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  }
}

export const mongoClient = client; // for reuse if needed
