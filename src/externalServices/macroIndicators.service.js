import axios from "axios";
import { MacroIndicator } from "../models/macroIndicators.model.js";
import { Country } from "../models/country.model.js";
import { ApiError } from "../utils/ApiError.js";
import {redisClient} from "../db/redisClient.js";
import logger from "../utils/logger.js";

const INDICATORS = {
  GDP: "NY.GDP.MKTP.CD",
  GDP_GROWTH: "NY.GDP.MKTP.KD.ZG",
  INFLATION: "FP.CPI.TOTL.ZG",
  UNEMPLOYMENT: "SL.UEM.TOTL.ZS",
};

const CACHE_DAYS = 30;
const REDIS_TTL = 60 * 60 * 24; // 24 hours



// Convert country name → countryCode
const getCountryCodeByName = async (countryName, context = {}) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "macroIndicators", action: "getCountryCodeByName", message: "Started", countryName });
  }

  const country = await Country.findOne({
    name: { $regex: new RegExp(`^${countryName}$`, "i") },
  });

  if (!country) {
    logger.error({ layer: "externalService", service: "macroIndicators", action: "getCountryCodeByName", message: "Country not supported", countryName });
    throw new ApiError(404, "Country not supported");
  }

  return country.code;
};




const fetchIndicator = async (countryCode, indicatorKey, indicatorCode, context = {}) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "macroIndicators", action: "fetchIndicator", message: "Started", countryCode, indicatorKey });
  }

  const redisKey = `macro:${countryCode}:${indicatorKey}`;
  console.log("Checking Redis for:", redisKey);

  // Redis check
 const cachedRedis = await redisClient.get(redisKey);
if (cachedRedis) {
  logger.debug({ layer: "cache", service: "macroIndicators", action: "fetchIndicator", message: "Redis HIT", redisKey });
  console.log("Redis HIT:", redisKey);
  return JSON.parse(cachedRedis);
}

  const now = new Date();

  //  Mongo check
  const existing = await MacroIndicator.findOne({
    countryCode,
    indicatorCode,
  });

  if (existing && existing.expiry > now && existing.data) {
  await redisClient.set(redisKey, JSON.stringify(existing.data), {
    EX: REDIS_TTL,
  });

  if (context?.source !== "cron") {
    logger.info({ layer: "cache", service: "macroIndicators", action: "fetchIndicator", message: "Mongo HIT", countryCode, indicatorKey });
  }

  return existing.data;
}

  //  Fetch full history from World Bank
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=200`;

  let response;

  try {
    if (context?.source !== "cron") {
      logger.info({ layer: "externalService", service: "macroIndicators", action: "fetchIndicator", message: "Calling external API", indicatorKey });
    }

    response = await axios.get(url);
  } catch (error) {
    logger.error({ layer: "externalService", service: "macroIndicators", action: "fetchIndicator", error: error.message });
    throw new ApiError(502, "Failed to fetch data from World Bank");
  }

  const rawData = response?.data?.[1];

  if (!rawData) {
    logger.error({ layer: "externalService", service: "macroIndicators", action: "fetchIndicator", message: "No data returned", indicatorKey });
    throw new ApiError(404, "Indicator data not available");
  }
  
  const cleanedData = rawData
  .filter((item) => item && item.value !== null && item.date)
  .map((item) => ({
    year: parseInt(item.date),
    value: Number(item.value),
  }))
  .sort((a, b) => b.year - a.year);


  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CACHE_DAYS);

  const updated = await MacroIndicator.findOneAndUpdate(
    { countryCode, indicatorCode },
    {
      countryCode,
      indicatorCode,
      indicatorName: rawData?.[0]?.indicator?.value,
      data: cleanedData,
      lastUpdated: now,
      expiry: expiryDate,
    },
   {
    returnDocument: "after",
    upsert: true,
     setDefaultsOnInsert: true,
  }
  );
  console.log("Saved to Mongo:", indicatorKey);

 // Save to Redis
await redisClient.set(redisKey, JSON.stringify(cleanedData), {
  EX: REDIS_TTL,
});

if (context?.source !== "cron") {
  logger.info({ layer: "externalService", service: "macroIndicators", action: "fetchIndicator", message: "Data processed and cached", indicatorKey });
}

return cleanedData;

 //console.log("RAW API DATA:", rawData.slice(0,5));
};





const getCountryMacroData = async (countryName, context = {}) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "macroIndicators", action: "getCountryMacroData", message: "Started", countryName });
  }

  if (!countryName) {
    logger.error({ layer: "externalService", service: "macroIndicators", action: "getCountryMacroData", message: "Country name missing" });
    throw new ApiError(400, "Country name is required");
  }

  const countryCode = await getCountryCodeByName(countryName, context);

  const indicatorEntries = Object.entries(INDICATORS);

  const values = await Promise.all(
    indicatorEntries.map(([key, indicatorCode]) =>
      fetchIndicator(countryCode, key, indicatorCode, context)
    )
  );
   //console.log("Macro values:", values);
  const result = {};

  indicatorEntries.forEach(([key], index) => {
    result[key] = values[index];  
  });

  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "macroIndicators", action: "getCountryMacroData", message: "Success", countryName });
  }

  return {
    country: countryName,
    macro: result,
  };
};






export { getCountryMacroData };