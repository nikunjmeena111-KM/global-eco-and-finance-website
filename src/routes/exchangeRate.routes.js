import { Router } from "express";
import { exchangeRateHandler } from "../controllers/exchange.controller.js";
import { exchangeLimiter } from "../middlewares/rateLimiter.middleware.js";
import { exchangeRateValidation } from "../validations/exchangeRate.validation.js";
import { validate } from "../middlewares/inputValidation.middleware.js";


const router = Router();

router.get("/", exchangeLimiter,exchangeRateValidation,validate,exchangeRateHandler);

export default router;