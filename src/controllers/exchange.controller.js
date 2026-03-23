import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { getExchangeRate } from "../externalServices/exchangeRate.service.js";
import { getCache, setCache } from "../utils/cacheHandler.js";
import logger from "../utils/logger.js";

const exchangeRateHandler = asyncHandler(async (req, res) => {

  logger.info({ layer: "controller", action: "exchangeRateHandler", message: "Request received" });

  const { from = "USD", to = "INR" } = req.query;

  const redisKey = `exchange:${from}:${to}`;

  //  Redis check
  const cached = await getCache(redisKey);

  if (cached) {
    logger.info({ layer: "cache", action: "exchangeRateHandler", message: "Redis HIT", from, to });
    console.log("Exchange Redis HIT");

    return res
      .status(200)
      .json(new ApiResponse(200, cached, "Exchange rate (cache)"));
  }

  logger.info({ layer: "cache", action: "exchangeRateHandler", message: "Redis MISS", from, to });
  console.log("Exchange Redis MISS");

  //  Fetch from service (which already uses Mongo snapshot)
  const rate = await getExchangeRate(from, to);

  const response = {
    //from,
    //to,
    rate
  };

  //  Cache result
  await setCache(redisKey, response, 600);

  logger.info({ layer: "controller", action: "exchangeRateHandler", message: "Success", from, to });

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Exchange rate fetched"));
});

export {exchangeRateHandler}