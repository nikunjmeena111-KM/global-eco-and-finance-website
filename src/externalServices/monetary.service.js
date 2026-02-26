import axios from "axios";
import { Monetary } from "../models/monetary.model.js";
import { Country } from "../models/country.model.js";

const TE_BASE_URL = "https://api.tradingeconomics.com";
const CACHE_EXPIRY_DAYS = 30;

const isExpired = (lastUpdated) => {
  const now = new Date();
  const diffDays =
    (now - new Date(lastUpdated)) / (1000 * 60 * 60 * 24);
  return diffDays > CACHE_EXPIRY_DAYS;
};

const fetchPolicyRate = async (countryName) => {
  const url = `${TE_BASE_URL}/country/${countryName}/indicator/Interest Rate?c=${process.env.TE_API_KEY}`;
  const response = await axios.get(url);
  return response.data?.[0] || null;
};

const fetchReserveRequirement = async (countryName) => {
  const url = `${TE_BASE_URL}/country/${countryName}/indicator/Reserve Requirement?c=${process.env.TE_API_KEY}`;
  const response = await axios.get(url);
  return response.data?.[0] || null;
};

export const getMonetaryData = async (countryName) => {

  //  Resolve country from DB
  const country = await Country.findOne({ name: countryName });

  if (!country) {
    throw new Error("Country not found");
  }

  //  Check cache
  const existing = await Monetary.findOne({
    countryCode: country.code
  });

  if (existing && !isExpired(existing.lastUpdated)) {
    return existing;
  }

  //  Fetch from Trading Economics
  const [policyData, reserveData] = await Promise.all([
    fetchPolicyRate(countryName),
    fetchReserveRequirement(countryName)
  ]);

  const policyRate = policyData?.LatestValue ?? null;
  const reserveRequirement = reserveData?.LatestValue ?? null;

  const year =
    policyData?.Date
      ? new Date(policyData.Date).getFullYear()
      : new Date().getFullYear();

  // Upsert
  const updated = await Monetary.findOneAndUpdate(
    { countryCode: country.code },
    {
      country: country.name,
      countryCode: country.code,
      policyRate,
      reserveRequirement,
      year,
      source: "TradingEconomics",
      lastUpdated: new Date()
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );

  return updated;
};