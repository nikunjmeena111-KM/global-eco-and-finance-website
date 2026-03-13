import express from "express";
import { dashboardHandler } from "./dashboard.controller.js";
import { heavyEndpointLimiter } from "../middlewares/rateLimiter.middleware.js";


const router = express.Router();

router.route("/").get(heavyEndpointLimiter,dashboardHandler);

export default router;