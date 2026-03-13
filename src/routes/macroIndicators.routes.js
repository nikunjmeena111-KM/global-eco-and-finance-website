import { Router } from "express";
import { getMacroData } from "../controllers/macroIndicators.controller.js";
import { heavyEndpointLimiter } from "../middlewares/rateLimiter.middleware.js";
import { macroDataValidation } from "../validations/macroData.validation.js";
import { validate } from "../middlewares/inputValidation.middleware.js";

const router = Router();

router.get("/", heavyEndpointLimiter, macroDataValidation,validate,getMacroData);
 
export default router;