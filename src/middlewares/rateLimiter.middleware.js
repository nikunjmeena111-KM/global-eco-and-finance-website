import rateLimit from "express-rate-limit";
import { ApiResponse } from "../utils/ApiResponse.js";


// Global API Rate Limiter
// Protects the entire API from excessive requests


 const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,

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




//Heavy Endpoint Limiter
//For expensive endpoints like dashboard and macro data


 const heavyEndpointLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // stricter limit

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




//Exchange Rate Limiter
//Prevents abuse of currency conversion endpoint


 const exchangeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,

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




// Authentication Limiter (Future Use)
// Protects login/register endpoints from brute-force attacks


 const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,

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