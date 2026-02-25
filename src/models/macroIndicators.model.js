import mongoose from "mongoose";

const macroIndicatorSchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },

    indicatorCode: {
      type: String,
      required: true,
      index: true,
    },

    indicatorName: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    source: {
      type: String,
      default: "WorldBank",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    expiry: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate same country + indicator + year
macroIndicatorSchema.index(
  { countryCode: 1, indicatorCode: 1, year: 1 },
  { unique: true }
);

export const MacroIndicator = mongoose.model(
  "MacroIndicator",
  macroIndicatorSchema
);