import axios from "axios";
import { ApiError } from "../utils/ApiError.js";
import { FRED_SERIES } from "../constants/FREDids.series.js";

const FRED_BASE_URL = "https://api.stlouisfed.org/fred/series/observations";


const fetchSeries = async (seriesId) => {
  const FRED_API_KEY = process.env.FRED_API_KEY;

if (!FRED_API_KEY) {
  throw new Error("FRED_API_KEY not configured");
}


  try {
    const response = await axios.get(FRED_BASE_URL, {
      params: {
        series_id: seriesId,
        api_key: FRED_API_KEY,
        file_type: "json",
        sort_order: "desc",
        limit: 1,
      },
      timeout: 8000,
    });

    const observations = response.data?.observations;

    if (!observations || observations.length === 0) {
      return null;
    }

    const value = observations[0]?.value;

    if (!value || value === ".") {
      return null;
    }

    return Number(value);

  } catch (error) {
  throw new ApiError(502, `FRED series fetch failed for ${seriesId}`);
}
}

const fetchMonetaryFromFRED = async (countryCode) => {
  try {
    const series = FRED_SERIES[countryCode];

    if (!series) {
      throw new ApiError(400, `FRED not configured for ${countryCode}`);
    }

    const safeFetch = async (seriesId) => {
  if (!seriesId) return null;

  try {
    return await fetchSeries(seriesId);
  } catch {
    return null;
  }
};

const [
  policyRate,
  moneySupplyM2,
  domesticCredit,
  bondYield10Y,
  inflation,
  industrialProduction,
] = await Promise.all([
  safeFetch(series.policyRate),
  safeFetch(series.moneySupplyM2),
  safeFetch(series.domesticCredit),
  safeFetch(series.bondYield10Y),
  safeFetch(series.inflation),
  safeFetch(series.industrialProduction),
]);

    return {
      policyRate,
      moneySupplyM2,
      domesticCredit,
      bondYield10Y,
      inflation,
      industrialProduction,
      source: "FRED",
    };

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "FRED service unavailable");
  }
};

export{fetchMonetaryFromFRED}