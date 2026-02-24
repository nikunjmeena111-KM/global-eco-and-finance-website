import dotenv from "dotenv";
import mongoose from "mongoose";

import { getExchangeRate } from "./externalServices/exchangeRate.service.js";
import "./models/exchangeRate.model.js"; // Ensure model loads

dotenv.config();

const runTest = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.mongodb_URL);
    console.log("✅ MongoDB Connected\n");

    console.log("🚀 First Call (Should hit API)");
    const first = await getExchangeRate("USD", "INR");
    console.log(first);

    console.log("\n🚀 Second Call (Should hit CACHE)");
    const second = await getExchangeRate("USD", "INR");
    console.log(second);

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB Disconnected");
  }
};

runTest();