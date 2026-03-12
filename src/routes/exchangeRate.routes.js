import { Router } from "express";
import { exchangeRateHandler } from "../controllers/exchange.controller.js";

const router = Router();

router.get("/", exchangeRateHandler);

export default router;