import mongoose from "mongoose";

const monetarySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    countryCode: {
      type: String,
      required: true,
      uppercase: true
    },

    // ---- Core Monetary & Financial Indicators ----

    policyRate: {
      type: Number,
      default: null
    },

    moneySupplyM2: {
      type: Number,
      default: null
    },

    domesticCredit: {
      type: Number,
      default: null
    },

    bondYield10Y: {
      type: Number,
      default: null
    },

    inflation: {
      type: Number,
      default: null
    },

    industrialProduction: {
      type: Number,
      default: null
    },

    // ---- Metadata ----

    source: {
      type: String,
      default: "FRED"
    },

    year: {
      type: Number,
      default: null
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Ensure only one monetary document per country
monetarySchema.index({ countryCode: 1 }, { unique: true });

export const Monetary = mongoose.model("Monetary", monetarySchema);