import express from "express";
import { dashboardHandler } from "./dashboard.controller.js";

const router = express.Router();

router.route("/").get(dashboardHandler);

export default router;