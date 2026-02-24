import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    indexSymbol: {
      type: String,
      required: true,
      trim: true
    },

    capitalGainsTax: {
      type: String,
      required: true
    },

    dividendTax: {
      type: String,
      required: true
    },
    exchanges: [
  {
    name: String,        // "NSE"
    code: String,        // "NSE"
    indexSymbol: String  // "NIFTY"
  }
],

    brokerageAvg: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

console.log("Country model loaded");

export const Country = mongoose.model("Country", countrySchema);