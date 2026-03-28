import cron from "node-cron";
import {redisClient} from "../db/redisClient.js";
import { STOCK_SYMBOLS } from "../constants/stockSymbols.js";
import { fetchUSIndexFromAPI } from "../externalServices/stock.service.js";
import logger from "../utils/logger.js";

// 🔥 CONFIG
const CACHE_TTL = 150;
const COUNTRY_BATCH_SIZE = 4;
const DELAY_BETWEEN_BATCH = 1200;

const updateStockCache = async () => {
  logger.info({
    layer: "cron",
    service: "stock",
    message: "Stock cron started"
  });

  try {
    const countries = Object.entries(STOCK_SYMBOLS);

    for (let i = 0; i < countries.length; i += COUNTRY_BATCH_SIZE) {
      const batch = countries.slice(i, i + COUNTRY_BATCH_SIZE);

      await Promise.all(
        batch.map(async ([countryCode, countryData]) => {
          try {
            const exchanges = Object.entries(countryData.exchanges);

            // 🔥 FETCH WITH DEBUG
            const results = await Promise.all(
              exchanges.map(async ([exchangeKey, exchangeData]) => {
                const apiData = await fetchStockFromAPI(exchangeData.symbol, { source: "cron" });

                console.log("📊 STOCK API RESULT:", countryCode, exchangeKey, apiData);

                return apiData;
              })
            );

            // 🔥 STORE
            await Promise.all(
              exchanges.map(async ([exchangeKey, exchangeData], index) => {
                const data = results[index];

                if (data) {
                  const finalData = {
                    ...data,
                    exchange: exchangeData.name
                  };

                  console.log("💾 SAVING TO REDIS:", `stock:${countryCode}:${exchangeKey}`, finalData);

                  await redisClient.set(
                    `stock:${countryCode}:${exchangeKey}`,
                    JSON.stringify(finalData),
                    { EX: CACHE_TTL }
                  );
                } else {
                  console.log("⚠️ NO DATA FROM API:", countryCode, exchangeKey);
                }
              })
            );

          } catch (error) {
            logger.error({
              layer: "cron",
              service: "stock",
              error: error.message,
              countryCode
            });
          }
        })
      );

      await new Promise(res => setTimeout(res, DELAY_BETWEEN_BATCH));
    }

    logger.info({
      layer: "cron",
      service: "stock",
      message: "Stock cron completed"
    });

  } catch (error) {
    logger.error({
      layer: "cron",
      service: "stock",
      message: "Stock cron failed",
      error: error.message
    });
  }
};

// 🔁 RUN EVERY 1 MIN
cron.schedule("* * * * *", async () => {
  await updateStockCache();
});

export { updateStockCache };