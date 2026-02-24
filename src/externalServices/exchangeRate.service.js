import axios from "axios";
import ExchangeRate from "../models/exchangeRate.model.js";
import {ApiError} from "../utils/ApiError.js";

// Cache duration (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

 const getExchangeRate = async (from, to) => {
  from = from.toUpperCase();
  to = to.toUpperCase();

  // Check if data exists in DB
  const existingRate = await ExchangeRate.findOne({ from, to });

  if (existingRate) {
    const now = Date.now();
    const lastUpdated = new Date(existingRate.updatedAt).getTime();

    //  If cache is still valid → return cached data
    if (now - lastUpdated < CACHE_DURATION) {
      return {
        from,
        to,
        rate: existingRate.rate,
        source: "cache",
        lastUpdated: existingRate.updatedAt,
      };
    }
  }

  //  If no cache OR expired → fetch from API
  const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

  if (!API_KEY) {
    throw new ApiError(500, "Exchange Rate API key not configured");
  }

  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
    );

    const rate = response.data.conversion_rates[to];

    if (!rate) {
      throw new ApiError(404, "Target currency not supported");
    }

    //  Save or Update DB (Upsert)
    const updatedRate = await ExchangeRate.findOneAndUpdate(
      { from, to },
      { rate },
      { upsert: true, new: true }
    );

    return {
      from,
      to,
      rate,
      source: "api",
      lastUpdated: updatedRate.updatedAt,
    };

  } catch (error) {
    throw new ApiError(
      500,
      error.response?.data?.error || "Failed to fetch exchange rate"
    );
  }
};


export{getExchangeRate}