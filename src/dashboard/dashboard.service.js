import { ApiError } from "../utils/ApiError.js";

import { getCountryData,getCountryList  } from "../externalServices/country.service.js";
import { getExchangeRate } from "../externalServices/exchangeRate.service.js";
import { getMonetaryData } from "../externalServices/monetary.service.js";
import { getGlobalNews } from "../externalServices/news.service.js";
import { getStockQuote } from "../externalServices/stock.service.js";

import {DashboardSnapshot} from "../models/dashboardSnapshot.model.js";
import { getCache, setCache } from "../utils/cacheHandler.js";



// INITIAL DASHBOARD (No country selected)
const getInitialDashboard = async () => {
  try {
    const [countries, news, exchange] = await Promise.all([
      getCountryList() ,              // all countries
      getGlobalNews(),               // global finance news
      getExchangeRate("USD", "INR"), // default exchange pair
    ]);

    return {
      countries,
      news,
      exchange,
    };

  } catch (error) {
    throw new ApiError(500, "Failed to load initial dashboard data");
  }
};
 




  // COUNTRY DASHBOARD SNAPSHOT (v1)

   const SNAPSHOT_TTL_MINUTES = 5;

  const getCountryDashboard = async (countryCode) => {
  if (!countryCode) {
    throw new ApiError(400, "Country code is required");
  }

  const upperCode = countryCode.toUpperCase();

  const redisKey = `dashboard:v1:${upperCode}`;

  // 1️ Check Redis First
  const cachedData = await getCache(redisKey);

  if (cachedData) {
     console.log(" Redis HIT");
  return cachedData;
  }
  console.log(" Redis MISS");

  // 1Get static snapshot
  const staticSnapshot = await getOrCreateStaticSnapshot(upperCode);

  // Fetch dynamic data fresh
  const stockQuote = await getStockQuote(upperCode).catch(() => null);

  //  Merge into final structure
  const finalResponse= {
    version: staticSnapshot.version,
    countryCode: staticSnapshot.countryCode,

    static: staticSnapshot.static,

    dynamic: {
      stockIndex: stockQuote || null,
    },
  };

  // Store in Redis (60 sec TTL)
   await setCache(redisKey, finalResponse, 60);

   return finalResponse;

};

const generateStaticSnapshot = async (countryCode) => {
  const [
    countryData,
    monetaryData,
    newsData,
    defaultExchange
  ] = await Promise.all([
    getCountryData(countryCode),
    getMonetaryData(countryCode),
    getGlobalNews(),               // FIX NEWS
    getExchangeRate("USD", "INR")  // DEFAULT EXCHANGE
  ]); 

  return {
    version: "v1",
    countryCode,
    static: {
      country: countryData,
      monetary: monetaryData,
      news: newsData,
      exchange: defaultExchange
    }
  };
};

//const SNAPSHOT_TTL_MINUTES = 5;

const getOrCreateStaticSnapshot = async (countryCode) => {

  //const SNAPSHOT_TTL_MINUTES = 5;
  const upperCode = countryCode.toUpperCase();
  const now = new Date();

  const existingSnapshot = await DashboardSnapshot.findOne({
    countryCode: upperCode,
    version: "v1",
  });

  if (existingSnapshot && existingSnapshot.expiresAt > now) {
    return existingSnapshot.data;
  }

  const staticData = await generateStaticSnapshot(upperCode);

  const expiresAt = new Date(
    now.getTime() + SNAPSHOT_TTL_MINUTES * 60 * 1000
  );

  await DashboardSnapshot.findOneAndUpdate(
    { countryCode: upperCode, version: "v1" },
    {
      data: staticData,
      expiresAt,
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    }
  );

  return staticData;
};

export{getInitialDashboard,getCountryDashboard}