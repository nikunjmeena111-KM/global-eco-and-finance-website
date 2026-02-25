import mongoose from "mongoose";
import dotenv from "dotenv";

import { getCountryMacroData } from "./externalServices/macroIndicators.service.js";
import { ApiError } from "./utils/ApiError.js";

dotenv.config();

const runTest = async () => {
  try {
    console.log("🔌 Connecting to DB...");
    await mongoose.connect(process.env.mongodb_URL);
    console.log("✅ Connected to MongoDB\n");

    const country = "china";
    const year = 2021;

    console.log(`📊 Fetching macro data for ${country} (${year})...\n`);

    const result = await getCountryMacroData(country, year);

    console.log("✅ Service Response:\n");
    console.dir(result, { depth: null });

  } catch (error) {
    if (error instanceof ApiError) {
      console.error("❌ ApiError:");
      console.error("Status:", error.statusCode);
      console.error("Message:", error.message);
    } else {
      console.error("❌ Unexpected Error:", error);
    }
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from DB");
    process.exit();
  }
};

runTest();