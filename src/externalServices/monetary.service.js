import { Country } from "../models/country.model.js";
import { Monetary } from "../models/monetary.model.js";
import { fetchMonetaryFromFRED } from "../adapters/fredAPI.adapter.js";
import { ApiError } from "../utils/ApiError.js";

const THIRTY_DAYS = 1000 * 60 * 60 * 24 * 30;

export const getMonetaryData = async (countryInput) => {
  try {
    //  Resolve country (by name OR ISO2 code)
    const country = await Country.findOne({
      $or: [
        { name: new RegExp(`^${countryInput}$`, "i") },
        { code: countryInput.toUpperCase() },
      ],
    });

    if (!country) {
      throw new ApiError(404, "Country not found");
    }

    const { name: countryName, code: countryCode } = country;

    // Check cache
    const existing = await Monetary.findOne({ countryCode });

    if (existing) {
      const isExpired =
        Date.now() - new Date(existing.lastUpdated).getTime() >
        THIRTY_DAYS;

      if (!isExpired) {
        return existing;
      }
    }

    //  Fetch fresh data from adapter
    const monetaryData = await fetchMonetaryFromFRED(countryCode);

    if (!monetaryData) {
      throw new ApiError(502, "Failed to fetch monetary data");
    }

    // Prepare unified document
    const payload = {
      country: countryName,
      countryCode,
      policyRate: monetaryData.policyRate ?? null,
      moneySupplyM2: monetaryData.moneySupplyM2 ?? null,
      domesticCredit: monetaryData.domesticCredit ?? null,
      bondYield10Y: monetaryData.bondYield10Y ?? null,
      inflation: monetaryData.inflation ?? null,
      industrialProduction: monetaryData.industrialProduction ?? null,
      source: "FRED",
      year: new Date().getFullYear(),
      lastUpdated: new Date(),
    };

    // Upsert (cache-aside pattern)
    const updated = await Monetary.findOneAndUpdate(
      { countryCode },
      payload,
      {
          returnDocument: "after",
          upsert: true
      }
    );

    return updated;

  } catch (error) {
  console.error("REAL ERROR:", error);

  if (error.statusCode) {
    throw error;
  }

  throw new ApiError(500, error.message || "Monetary service failed");
}
};