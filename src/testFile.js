import mongoose from "mongoose";
import dotenv from "dotenv";
import { getMonetaryData } from "./externalServices/monetary.service.js";

dotenv.config();

const MONGO_URI = process.env.mongodb_URL;

if (!MONGO_URI) {
  throw new Error("MONGO_URI not configured");
}

const runTest = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected\n");

    // 🇩🇪 Germany
    console.log("🚀 Testing Germany (DE) monetary data...");
    const germany = await getMonetaryData("ES");
    console.log("Germany Result:\n", germany, "\n");

    // 🇨🇳 China
    console.log("🚀 Testing China (CN) monetary data...");
    const china = await getMonetaryData("SG");
    console.log("China Result:\n", china, "\n");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

runTest();