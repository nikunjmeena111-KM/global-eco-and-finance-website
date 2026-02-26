import mongoose from "mongoose";

const monetarySchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    countryCode: {
      type: String, // ISO-2 (IN, US)
      required: true,
      uppercase: true
    },

    policyRate: {
      type: Number,
      default: null
    },

    reserveRequirement: {
      type: Number,
      default: null
    },

    year: {
      type: Number,
      required: true
    },

    source: {
      type: String,
      default: "IMF"
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

// 🔹 Ensure one monetary record per country
monetarySchema.index({ countryCode: 1 }, { unique: true });

export const Monetary = mongoose.model("Monetary", monetarySchema);