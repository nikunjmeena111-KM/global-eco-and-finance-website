import axios from "axios";
import { FRED_SERIES } from "../constants/FREDids.series.js";
import { ApiError } from "../utils/ApiError.js";

const BASE_URL = "https://api.stlouisfed.org/fred/series/observations";
//console.log(process.env.FRED_API_KEY)

//console.log("FRED_SERIES object:", FRED_SERIES);
const fetchSeries = async (seriesId) => {
    if (!process.env.FRED_API_KEY) {
    throw new ApiError(500, "FRED API key not configured");
  }
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        series_id: seriesId,
        api_key: process.env.FRED_API_KEY,
        file_type: "json",
        sort_order: "desc",
        limit: 1,
      },
      timeout: 8000,
    });

    const observation = response.data?.observations?.[0];

    if (!observation || observation.value === "." || observation.value == null) {
      return null;
    }

    const numericValue = parseFloat(observation.value);
    return isNaN(numericValue) ? null : numericValue;

  } catch (error) {
    return null;
  }
};

 const fetchMonetaryFromFRED = async (countryCode) => {
    console.log("CountryCode:", countryCode);

  try {
    const series = FRED_SERIES[countryCode];
    //console.log("Series Mapping:", series)

    if (!series) {
      throw new ApiError(400, `FRED not configured for ${countryCode}`);
    }
//console.log("Mapping for US:", FRED_SERIES[countryCode]);
    const [
      policyRate,
      moneySupplyM2,
      domesticCredit,
      bondYield10Y,
      inflation,
      industrialProduction,
    ] = await Promise.all([
      fetchSeries(series.policyRate),
      fetchSeries(series.moneySupplyM2),
      fetchSeries(series.domesticCredit),
      fetchSeries(series.bondYield10Y),
      fetchSeries(series.inflation),
      fetchSeries(series.industrialProduction),
    ]);

    return {
      policyRate,
      moneySupplyM2,
      domesticCredit,
      bondYield10Y,
      inflation,
      industrialProduction,
    };

  } catch (error) {
    throw new ApiError(502, "FRED service unavailable");
  }
};


export{fetchMonetaryFromFRED}