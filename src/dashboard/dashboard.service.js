import { ApiError } from "../utils/ApiError.js";

import { getCountryData,getCountryList  } from "../externalServices/country.service.js";
import { getExchangeRate } from "../externalServices/exchangeRate.service.js";
import { getMonetaryData } from "../externalServices/monetary.service.js";
import { getGlobalNews } from "../externalServices/news.service.js";
import { fetchUSIndexFromAPI  } from "../externalServices/stock.service.js";

import {DashboardSnapshot} from "../models/dashboardSnapshot.model.js";
import { getCache, setCache } from "../utils/cacheHandler.js";
import logger from "../utils/logger.js";



// INITIAL DASHBOARD (No country selected)
const getInitialDashboard = async () => {
  try {
    logger.info({ layer: "service", service: "dashboard", action: "getInitialDashboard", message: "Started" });

    const [countries, news, exchange] = await Promise.all([
      getCountryList() ,              
      getGlobalNews(),               
      getExchangeRate("USD", "INR"), 
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

  const cachedData = await getCache(redisKey);

  if (cachedData) {
    logger.debug({ layer: "cache", service: "dashboard", action: "getCountryDashboard", message: "Redis HIT", countryCode: upperCode });
    return cachedData;
  }

  logger.debug({ layer: "cache", service: "dashboard", action: "getCountryDashboard", message: "Redis MISS", countryCode: upperCode });

  const staticSnapshot = await getOrCreateStaticSnapshot(upperCode);

  const stockQuoteResult = await fetchUSIndexFromAPI(upperCode)
    .then(data => ({ status: "ok", data }))
    .catch(() => ({ status: "failed", data: null }));

  const finalResponse = {
    meta: {
      country: upperCode,
      version: staticSnapshot.version,
      timestamp: new Date().toISOString(),
      source: "mixed"
    },
    data: {
      static: staticSnapshot.static,
      dynamic: {
        stock: stockQuoteResult.data
      }
    },
    status: {
      stock: stockQuoteResult.status
    }
  };

  await setCache(redisKey, finalResponse, 60);

  logger.info({ layer: "service", service: "dashboard", action: "getCountryDashboard", message: "Success", countryCode: upperCode });

  return finalResponse;
};






const generateStaticSnapshot = async (countryCode,context={} ) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "service", service: "dashboard", action: "generateStaticSnapshot", message: "Started", countryCode });
  }

  const results = await Promise.allSettled([
    getCountryData(countryCode),
    getMonetaryData(countryCode,context),
    getGlobalNews(context),
    getExchangeRate("USD", "INR",context)
  ]);

  const [countryRes, monetaryRes, newsRes, exchangeRes] = results;

  const staticData = {
    country: countryRes.status === "fulfilled" ? countryRes.value : null,
    monetary: monetaryRes.status === "fulfilled" ? monetaryRes.value : null,
    news: newsRes.status === "fulfilled" ? newsRes.value : null,
    exchange: exchangeRes.status === "fulfilled" ? exchangeRes.value : null,
  };

  const status = {
    country: countryRes.status === "fulfilled" ? "ok" : "failed",
    monetary: monetaryRes.status === "fulfilled" ? "ok" : "failed",
    news: newsRes.status === "fulfilled" ? "ok" : "failed",
    exchange: exchangeRes.status === "fulfilled" ? "ok" : "failed",
  };

  if (context?.source !== "cron") {
    logger.info({ layer: "service", service: "dashboard", action: "generateStaticSnapshot", message: "Success", countryCode });
  }

  return {
    version: "v1",
    countryCode,
    static: staticData,
    status
  };
};




//const SNAPSHOT_TTL_MINUTES = 5;

const getOrCreateStaticSnapshot = async (countryCode,context={} ) => {

  if (context?.source !== "cron") {
    logger.info({ layer: "service", service: "dashboard", action: "getOrCreateStaticSnapshot", message: "Started", countryCode });
  }

  const upperCode = countryCode.toUpperCase();
  const now = new Date();

  const existingSnapshot = await DashboardSnapshot.findOne({
    countryCode: upperCode,
    version: "v1",
  });

  if (existingSnapshot && existingSnapshot.expiresAt > now) {
    if (context?.source !== "cron") {
      logger.info({ layer: "service", service: "dashboard", action: "getOrCreateStaticSnapshot", message: "Using existing snapshot", countryCode: upperCode });
    }
    return existingSnapshot.data;
  }

  const staticData = await generateStaticSnapshot(upperCode,context);

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

  if (context?.source !== "cron") {
    logger.info({ layer: "service", service: "dashboard", action: "getOrCreateStaticSnapshot", message: "New snapshot created", countryCode: upperCode });
  }

  return staticData;
};




const refreshStaticSnapshot = async (countryCode,context={} ) => {
  if (context?.source !== "cron") {
    logger.info({ layer: "service", service: "dashboard", action: "refreshStaticSnapshot", message: "Started", countryCode });
  }

  const staticData = await generateStaticSnapshot(countryCode,context); 

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

  if (context?.source !== "cron") {
    logger.info({ layer: "service", service: "dashboard", action: "refreshStaticSnapshot", message: "Success", countryCode });
  }

  return snapshotData;
};



export{getInitialDashboard,getCountryDashboard,refreshStaticSnapshot,generateStaticSnapshot}