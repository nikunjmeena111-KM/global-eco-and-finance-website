import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../db/redisClient.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// Redis Store Configuration


const createRedisStore= () => {
  return new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  });
};



// Global API Rate Limiter
// Protects the entire API


 const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  store: createRedisStore(),

  handler: (req, res) => {
    return res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Too many requests. Please slow down and try again later."
        )
      );
  },
});



// Heavy Endpoint Limiter
//For expensive endpoints (dashboard, macro)


 const heavyEndpointLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  store: createRedisStore(),

  handler: (req, res) => {
    return res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Too many requests to this resource. Please try again later."
        )
      );
  },
});


// Exchange Endpoint Limiter
//Protects currency conversion endpoint


 const exchangeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  store:createRedisStore(),

  handler: (req, res) => {
    return res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Exchange rate request limit exceeded. Please try again later."
        )
      );
  },
});




// Authentication Limiter
// Prevent brute-force login attempts


 const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  store: createRedisStore(),

  handler: (req, res) => {
    return res
      .status(429)
      .json(
        new ApiResponse(
          429,
          null,
          "Too many authentication attempts. Please try again later."
        )
      );
  },
});

export{globalRateLimiter,heavyEndpointLimiter,exchangeLimiter,authLimiter}