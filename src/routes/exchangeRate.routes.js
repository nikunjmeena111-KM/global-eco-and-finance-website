import { Router } from "express";
import { exchangeRateHandler } from "../controllers/exchange.controller.js";
import { exchangeLimiter } from "../middlewares/rateLimiter.middleware.js";


const router = Router();

router.get("/", exchangeLimiter,exchangeRateHandler);

export default router;