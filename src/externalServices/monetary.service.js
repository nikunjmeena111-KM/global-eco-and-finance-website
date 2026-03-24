import { Monetary } from "../models/monetary.model.js";
import { Country } from "../models/country.model.js";
import { fetchMonetaryFromFRED } from "../adapters/fredAPI.adapter.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const CACHE_EXPIRY_DAYS = 30;

const getMonetaryData = async (countryInput,context={}) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "externalService", service: "monetary", action: "getMonetaryData", message: "Started", countryInput });
  }

  try {
    //  Resolve country from DB
   const country = await Country.findOne({
  $or: [
    { code: countryInput.toUpperCase() },   // ← correct field
    { name: { $regex: `^${countryInput}$`, $options: "i" } }
  ]
});

    if (!country) {
      logger.error({ layer: "externalService", service: "monetary", action: "getMonetaryData", message: "Country not found", countryInput });
      throw new ApiError(404, "Country not found");
    }

    const countryCode = country.code;

    //  Check cache
    const existingData = await Monetary.findOne({ countryCode });

    if (existingData) {
      const now = new Date();
      const diffDays =
        (now - new Date(existingData.lastUpdated)) /
        (1000 * 60 * 60 * 24);

      if (diffDays < CACHE_EXPIRY_DAYS) {
        if (context?.source !== "cron") {
          logger.info({ layer: "cache", service: "monetary", action: "getMonetaryData", message: "Mongo HIT", countryCode });
        }
        return existingData;
      }
    }

    //  Fetch fresh data from FRED
    if (context?.source !== "cron") {
        logger.info({ message: "Fetching from FRED" });
    }

    const freshData = await fetchMonetaryFromFRED(countryCode);

    // Upsert into DB
    const updated = await Monetary.findOneAndUpdate(
      { countryCode },
      {
        ...freshData,
        country: country.country,
        countryCode,
        year: new Date().getFullYear(),
        lastUpdated: new Date(),
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    if (context?.source !== "cron") {
      logger.info({ layer: "externalService", service: "monetary", action: "getMonetaryData", message: "Success", countryCode });
    }

    return updated;

  } catch (error) {
    logger.error({ layer: "externalService", service: "monetary", action: "getMonetaryData", error: error.message });

    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Monetary service failed");
  }
};


export{getMonetaryData}