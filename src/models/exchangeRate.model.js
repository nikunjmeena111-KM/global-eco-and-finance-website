import mongoose from "mongoose";

const exchangeRateSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    rate: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// Compound index for faster lookup
exchangeRateSchema.index({ from: 1, to: 1 });

const ExchangeRate = mongoose.model("ExchangeRate", exchangeRateSchema);

export default ExchangeRate;