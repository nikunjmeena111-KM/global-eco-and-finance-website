import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { getExchangeRate } from "../externalServices/exchangeRate.service.js";
import { getCache, setCache } from "../utils/cacheHandler.js";

const exchangeRateHandler = asyncHandler(async (req, res) => {

  const { from = "USD", to = "INR" } = req.query;

  const redisKey = `exchange:${from}:${to}`;

  //  Redis check
  const cached = await getCache(redisKey);

  if (cached) {
    console.log("Exchange Redis HIT");

    return res
      .status(200)
      .json(new ApiResponse(200, cached, "Exchange rate (cache)"));
  }

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

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Exchange rate fetched"));
});

export {exchangeRateHandler}