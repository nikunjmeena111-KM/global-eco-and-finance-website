import axios from "axios";
import ExchangeRate from "../models/exchangeRate.model.js";
import {ApiError} from "../utils/ApiError.js";
import logger from "../utils/logger.js";

// Cache duration (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

const getExchangeRate = async (from, to) => {
  logger.info({ layer: "externalService", service: "exchangeRate", message: "Started", from, to });

  from = from.toUpperCase();
  to = to.toUpperCase();

  // Check if data exists in DB
  const existingRate = await ExchangeRate.findOne({ from, to });

  if (existingRate) {
    const now = Date.now();
    const lastUpdated = new Date(existingRate.updatedAt).getTime();

    //  If cache is still valid → return cached data
    if (now - lastUpdated < CACHE_DURATION) {
      logger.info({ layer: "externalService", service: "exchangeRate", message: "Cache hit", from, to });

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
    logger.error({ layer: "externalService", service: "exchangeRate", message: "API key missing" });
    throw new ApiError(500, "Exchange Rate API key not configured");
  }

  try {
    logger.info({ layer: "externalService", service: "exchangeRate", message: "Calling external API", from });

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
    );

    const rate = response.data.conversion_rates[to];

    if (!rate) {
      logger.error({ layer: "externalService", service: "exchangeRate", message: "Target currency not supported", to });
      throw new ApiError(404, "Target currency not supported");
    }

    //  Save or Update DB (Upsert)
    const updatedRate = await ExchangeRate.findOneAndUpdate(
      { from, to },
      { rate },
      { upsert: true, new: true }
    );

    logger.info({ layer: "externalService", service: "exchangeRate", message: "API success", from, to });

    return {
      from,
      to,
      rate,
      source: "api",
      lastUpdated: updatedRate.updatedAt,
    };

  } catch (error) {
    logger.error({ layer: "externalService", service: "exchangeRate", error: error.message });

    throw new ApiError(
      500,
      console.error("Exchange API error:", error.response?.data || error.message),
      error.response?.data?.error || "Failed to fetch exchange rate"
    );
  }
};


export{getExchangeRate}