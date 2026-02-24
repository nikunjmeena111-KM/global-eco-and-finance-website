import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

//const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;


  // Get Stock Quote (Company or Index)
 
const getStockQuote = async (symbol) => {
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; 

  if (!symbol) {
    throw new ApiError(400, "Stock symbol is required");
  }

  try {
    const response = await axios.get(
      "https://www.alphavantage.co/query",
      {
        params: {
          function: "GLOBAL_QUOTE",
          symbol,
          apikey: API_KEY
        }
      }
    );

    //console.log("Full Quote Response:", response.data);
    const data = response.data["Global Quote"];

    if (!data || Object.keys(data).length === 0) {
      throw new ApiError(404, "Stock data not found");
    }

    return {
      symbol: data["01. symbol"],
      price: data["05. price"],
      change: data["09. change"],
      changePercent: data["10. change percent"],
      volume: data["06. volume"],
      latestTradingDay: data["07. latest trading day"]
    };

  } catch (error) {
    console.log("Stock Quote Error:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to fetch stock data");
  }
};



//Search Company By Name
 

const searchStock = async (keyword, exchangeCode = null) => {
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
  if (!keyword) {
    throw new ApiError(400, "Search keyword is required");
  }

  try {
    const response = await axios.get(
      "https://www.alphavantage.co/query",
      {
        params: {
          function: "SYMBOL_SEARCH",
          keywords: keyword,
          apikey: API_KEY
        }
      }
    );

    const matches = response.data.bestMatches;
    //console.log("Full response:", response.data);

    if (!matches || matches.length === 0) {
      throw new ApiError(404, "No matching companies found");
    }

    let filteredResults = matches;

    // 🔥 Filter by exchange if provided
    if (exchangeCode) {
      filteredResults = matches.filter(item => {
        const symbol = item["1. symbol"];

        // 🇮🇳 India
        if (exchangeCode === "NSE") return symbol.endsWith(".NS");
        if (exchangeCode === "BSE") return symbol.endsWith(".BO");

        // 🇯🇵 Japan
        if (exchangeCode === "TSE") return item["4. region"] === "Japan";

        // 🇺🇸 USA (NYSE / NASDAQ)
        if (exchangeCode === "NYSE" || exchangeCode === "NASDAQ")
          return item["4. region"] === "United States";

        return true;
      });
    }

    return filteredResults.slice(0, 5).map(item => ({
      symbol: item["1. symbol"],
      name: item["2. name"],
      region: item["4. region"],
      currency: item["8. currency"]
    }));

  } catch (error) {
    console.log("Stock Search Error:", error.response?.data || error.message);
    throw new ApiError(500, "Failed to search stock");
  }
};

export{getStockQuote,searchStock}