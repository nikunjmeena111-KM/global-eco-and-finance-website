import axios from "axios";
import { redisClient } from "../db/redisClient.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";


// 🔥 FETCH ALL US INDICES FROM API (USED BY CRON)
const fetchUSIndexFromAPI = async (context = {}) => {
  const API_KEY = process.env.FINNHUB_API_KEY;

  if (!API_KEY) {
    throw new ApiError(500, "Stock API key missing");
  }

  // 👉 SYMBOLS DEFINED HERE (AS YOU SAID)
  const indices = [
    { key: "sp500", symbol: "SPY", name: "S&P 500" },
    { key: "nasdaq", symbol: "QQQ", name: "NASDAQ" },
    { key: "dow", symbol: "DIA", name: "Dow Jones" }
  ];

  try {
    const resultsArray = await Promise.all(
      indices.map(async (index) => {
        try {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${index.symbol}&token=${API_KEY}`
          );

          const data = response.data;

          if (!data || data.c === 0) {
            return { key: index.key, data: null };
          }

          return {
            key: index.key,
            data: {
              name: index.name,
              symbol: index.symbol,
              price: data.c,
              change: data.d,
              changePercent: data.dp,
              lastUpdated: new Date()
            }
          };

        } catch (error) {
          logger.error({
            layer: "externalService",
            service: "stock",
            error: error.message,
            symbol: index.symbol
          });

          return { key: index.key, data: null };
        }
      })
    );

    const results = {};
    resultsArray.forEach(({ key, data }) => {
      results[key] = data;
    });

    return results;

  } catch (error) {
    logger.error({
      layer: "service",
      service: "stock",
      error: error.message
    });

    throw new ApiError(500, "Failed to fetch US indices");
  }
};


// 🔥 GET US STOCK INDICES (REDIS ONLY - FOR DASHBOARD)
const getUSStockIndices = async (context = {}) => {
  try {
    const redisKeys = {
      sp500: "stockIndex:us:sp500",
      nasdaq: "stockIndex:us:nasdaq",
      dow: "stockIndex:us:dow"
    };

    const results = {};

    const dataArray = await Promise.all(
      Object.entries(redisKeys).map(async ([key, redisKey]) => {
        try {
          const data = await redisClient.get(redisKey);

          return {
            key,
            data: data ? JSON.parse(data) : null
          };

        } catch (error) {
          logger.error({
            layer: "cache",
            service: "stock",
            error: error.message,
            key
          });

          return { key, data: null };
        }
      })
    );

    // 🔥 Convert to object
    dataArray.forEach(({ key, data }) => {
      results[key] = data;
    });

    if (context?.source !== "cron") {
      logger.info({
        layer: "cache",
        service: "stock",
        message: "US stock indices fetched from Redis"
      });
    }

    return results;

  } catch (error) {
    logger.error({
      layer: "service",
      service: "stock",
      error: error.message
    });

    throw new ApiError(500, "Failed to fetch US stock indices");
  }
};

export {
  fetchUSIndexFromAPI,   // 👉 cron will use this
  getUSStockIndices      // 👉 dashboard will use this
};