// src/tests/test.monetary.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import { getMonetaryData } from "./externalServices/monetary.service.js";

dotenv.config();

const runTest = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");

    await mongoose.connect(process.env.mongodb_URL);

    console.log("✅ MongoDB Connected");

    const countryName = "China"; // Change this to test other countries

    console.log(`🌍 Fetching monetary data for ${countryName}...\n`);

    const result = await getMonetaryData(countryName);

    console.log("📊 Monetary Data Result:");
    console.dir(result, { depth: null });

  } catch (error) {
    console.error("❌ Test Failed:");
    console.error(error.message || error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 MongoDB connection closed");
    process.exit(0);
  }
};

runTest();