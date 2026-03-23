import { ApiError } from "../utils/ApiError.js";

import { getCountryData,getCountryList  } from "../externalServices/country.service.js";
import { getExchangeRate } from "../externalServices/exchangeRate.service.js";
import { getMonetaryData } from "../externalServices/monetary.service.js";
import { getGlobalNews } from "../externalServices/news.service.js";
import { getStockQuote } from "../externalServices/stock.service.js";

import {DashboardSnapshot} from "../models/dashboardSnapshot.model.js";
import { getCache, setCache } from "../utils/cacheHandler.js";
import logger from "../utils/logger.js";



// INITIAL DASHBOARD (No country selected)
const getInitialDashboard = async () => {
  try {
    logger.info({ layer: "service", service: "dashboard", action: "getInitialDashboard", message: "Started" });

    const [countries, news, exchange] = await Promise.all([
      getCountryList() ,              // all countries
      getGlobalNews(),               // global finance news
      getExchangeRate("USD", "INR"), // default exchange pair
    ]);

    logger.info({ layer: "service", service: "dashboard", action: "getInitialDashboard", message: "Success" });

    return {
      countries,
      news,
      exchange,
    };

  } catch (error) {
    logger.error({ layer: "service", service: "dashboard", action: "getInitialDashboard", error: error.message });
    throw new ApiError(500, "Failed to load initial dashboard data");
  }
};
 





// COUNTRY DASHBOARD SNAPSHOT (v1)

const SNAPSHOT_TTL_MINUTES = 5;

const getCountryDashboard = async (countryCode) => {
  logger.info({ layer: "service", service: "dashboard", action: "getCountryDashboard", message: "Started", countryCode });

  if (!countryCode) {
    logger.error({ layer: "service", service: "dashboard", action: "getCountryDashboard", message: "Country code missing" });
    throw new ApiError(400, "Country code is required");
  }

  const upperCode = countryCode.toUpperCase();

  const redisKey = `dashboard:v1:${upperCode}`;

  // 1️ Check Redis First
  const cachedData = await getCache(redisKey);

  if (cachedData) {
     logger.debug({ layer: "cache", service: "dashboard", action: "getCountryDashboard", message: "Redis HIT", countryCode: upperCode });
  return cachedData;
  }
  logger.debug({ layer: "cache", service: "dashboard", action: "getCountryDashboard", message: "Redis MISS", countryCode: upperCode });

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

   logger.info({ layer: "service", service: "dashboard", action: "getCountryDashboard", message: "Success", countryCode: upperCode });

   return finalResponse;

};






const generateStaticSnapshot = async (countryCode) => {
  logger.info({ layer: "service", service: "dashboard", action: "generateStaticSnapshot", message: "Started", countryCode });

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

  logger.info({ layer: "service", service: "dashboard", action: "generateStaticSnapshot", message: "Success", countryCode });

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

  logger.info({ layer: "service", service: "dashboard", action: "getOrCreateStaticSnapshot", message: "Started", countryCode });

  //const SNAPSHOT_TTL_MINUTES = 5;
  const upperCode = countryCode.toUpperCase();
  const now = new Date();

  const existingSnapshot = await DashboardSnapshot.findOne({
    countryCode: upperCode,
    version: "v1",
  });

  if (existingSnapshot && existingSnapshot.expiresAt > now) {
    logger.info({ layer: "service", service: "dashboard", action: "getOrCreateStaticSnapshot", message: "Using existing snapshot", countryCode: upperCode });
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

  logger.info({ layer: "service", service: "dashboard", action: "getOrCreateStaticSnapshot", message: "New snapshot created", countryCode: upperCode });

  return staticData;
};




const refreshStaticSnapshot = async (countryCode) => {
  logger.info({ layer: "service", service: "dashboard", action: "refreshStaticSnapshot", message: "Started", countryCode });

  const staticData = await generateStaticSnapshot(countryCode); 

  const snapshotData = {
    version: "v1",
    countryCode,
    static: staticData,
  };

  await DashboardSnapshot.findOneAndUpdate(
    { countryCode },
    {
      data: snapshotData,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
    { upsert: true, returnDocument: "after" }
  );

  logger.info({ layer: "service", service: "dashboard", action: "refreshStaticSnapshot", message: "Success", countryCode });

  return snapshotData;
};



export{getInitialDashboard,getCountryDashboard,refreshStaticSnapshot,generateStaticSnapshot}