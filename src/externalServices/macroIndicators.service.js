import axios from "axios";
import { MacroIndicator } from "../models/macroIndicators.model.js";
import { Country } from "../models/country.model.js";
import { ApiError } from "../utils/ApiError.js";

const INDICATORS = {
  GDP: "NY.GDP.MKTP.CD",
  GDP_GROWTH: "NY.GDP.MKTP.KD.ZG",
  INFLATION: "FP.CPI.TOTL.ZG",
  UNEMPLOYMENT: "SL.UEM.TOTL.ZS",
};

const CACHE_DAYS = 30;

// Convert country name → countryCode
const getCountryCodeByName = async (countryName) => {
  const country = await Country.findOne({
    name: { $regex: new RegExp(`^${countryName}$`, "i") },
  });

  if (!country) {
    throw new ApiError(404, "Country not supported");
  }

  return country.code;
};

const fetchIndicator = async (countryCode, indicatorCode, year) => {
  const now = new Date();

  const existing = await MacroIndicator.findOne({
    countryCode,
    indicatorCode,
    year,
  });

  // Return cached if valid
  if (existing && existing.expiry > now) {
    return existing.value;
  }

  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorCode}?date=${year}&format=json`;
  //console.log("URL:", url);

  let response;

  try {
    response = await axios.get(url);
    //console.log("API RAW RESPONSE:", response.data);
  } catch (error) {
    throw new ApiError(502, "Failed to fetch data from World Bank");
  }
  const data = response.data?.[1];
  const value = data?.[0]?.value ?? null;

if (value === null) {
  throw new ApiError(
    404,
    "Indicator data not available for this year"
  );
}
  

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CACHE_DAYS);

  const updated = await MacroIndicator.findOneAndUpdate(
    { countryCode, indicatorCode, year },
    {
      countryCode,
      indicatorCode,
      indicatorName: data[0].indicator.value,
      value: data[0].value,
      year,
      lastUpdated: now,
      expiry: expiryDate,
    },
    { returnDocument: "after", upsert: true }
  );

  return updated.value;
};

 const getCountryMacroData = async (countryName, year) => {
  if (!countryName) {
    throw new ApiError(400, "Country name is required");
  }

  if (!year) {
    throw new ApiError(400, "Year is required");
  }

  const countryCode = await getCountryCodeByName(countryName);

  
 const indicatorEntries = Object.entries(INDICATORS);

const values = await Promise.all(
  indicatorEntries.map(([key, indicatorCode]) =>
    fetchIndicator(countryCode, indicatorCode, year)
  )
);

const result = {};

indicatorEntries.forEach(([key], index) => {
  result[key] = values[index];
});

  return {
    country: countryName,
    year,
    macro: result,
  };
};


export {getCountryMacroData}