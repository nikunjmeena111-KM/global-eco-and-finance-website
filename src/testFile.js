import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "./db/index.js";

import { getInitialDashboard, getCountryDashboard } from "./dashboard/dashboard.service.js";

const test = async () => {
  try {
    await connectDB();

    console.log("===== FINAL DASHBOARD TEST =====\n");

    // ---- INITIAL DASHBOARD ----
    const initial = await getInitialDashboard();

    console.log("Initial Dashboard:",initial);
    

    console.log("\n---------------------------------\n");

    // ---- COUNTRY DASHBOARD ----
    const country = await getCountryDashboard("IN");

    console.log("Country Dashboard:", country);
    

    await mongoose.connection.close();

  } catch (error) {
    console.error("Error occurred:");
    console.error(error);
  }
};

test();
