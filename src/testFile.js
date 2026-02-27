// src/tests/test.monetary.js

import dotenv from "dotenv";
import mongoose from "mongoose";

import { getMonetaryData } from "../src/externalServices/monetary.service.js";

dotenv.config();

const MONGO_URI = process.env.mongodb_URL;

const runTest = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected\n");

    console.log("🚀 Testing US monetary data...");
    const usData = await getMonetaryData("FR");
    console.log("US Result:\n", usData, "\n");

    console.log("🚀 Testing India monetary data...");
    const indiaData = await getMonetaryData("DE");
    console.log("India Result:\n", indiaData, "\n");

    console.log("🚀 Testing invalid country...");
    try {
      await getMonetaryData("XYZ");
    } catch (error) {
      console.log("Expected Error:", error.message);
    }

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");
    process.exit();
  }
};

runTest();