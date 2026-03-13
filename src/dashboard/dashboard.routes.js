import express from "express";
import { dashboardHandler } from "./dashboard.controller.js";
import { heavyEndpointLimiter } from "../middlewares/rateLimiter.middleware.js";
import { countryDashboardValidation } from "../validations/countryDashboard.validation.js";
import { validate } from "../middlewares/inputValidation.middleware.js";


const router = express.Router();

router.route("/").get(heavyEndpointLimiter,countryDashboardValidation,validate,dashboardHandler);

export default router;