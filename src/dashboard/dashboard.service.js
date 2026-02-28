// src/modules/dashboard/dashboard.service.js

import { ApiError } from "../utils/ApiError.js";

import { getCountryData,getCountryList  } from "../externalServices/country.service.js";
import { getExchangeRate } from "../externalServices/exchangeRate.service.js";
import { getMonetaryData } from "../externalServices/monetary.service.js";
import { getGlobalNews } from "../externalServices/news.service.js";
import { getStockQuote } from "../externalServices/stock.service.js";



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

const getCountryDashboard = async (countryCode) => {

  // hard fail — Missing country code
  if (!countryCode) {
    throw new ApiError(400, "Country code is required");
  }

  //  HARD FAIL — Invalid country
  const countryMeta = await getCountryData(countryCode);
  if (!countryMeta) {
    throw new ApiError(404, "Country not found");
  }

  //  HARD FAIL — Monetary must exist
  let monetary;
  try {
    monetary = await getMonetaryData(countryCode);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch monetary data");
  }

  //  SOFT FAIL — News (optional fallback later)
  let news = [];
  try {
    news = await getGlobalNews(); // later replace with country-specific
  } catch (error) {
    news = [];
  }

  //  SOFT FAIL — Stock (high volatility)
  let stockIndex = null;
  try {
    if (countryMeta.indexSymbol) {
      stockIndex = await getStockQuote(countryMeta.indexSymbol);
    }
  } catch (error) {
    stockIndex = null;
  }

  return {
    version: "v1",
    countryCode,
    generatedAt: new Date().toISOString(),

    static: {
      countryMeta: {
        name: countryMeta.name,
        code: countryMeta.code,
        indexSymbol: countryMeta.indexSymbol,
        brokerageAvg: countryMeta.brokerageAvg,
        exchanges: countryMeta.exchanges,
      },

      monetary,
      news,
    },

    dynamic: {
      stockIndex,
    },
  };
};


export{getInitialDashboard,getCountryDashboard}