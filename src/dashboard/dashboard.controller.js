import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getInitialDashboard,getCountryDashboard } from "./dashboard.service.js";
import logger from "../utils/logger.js";

const dashboardHandler = asyncHandler(async (req, res) => {

  logger.info({ layer: "controller", action: "dashboardHandler", message: "Request received" });

  const { country } = req.query;

  const data = country
    ? await getCountryDashboard(country)
    : await getInitialDashboard();

  logger.info({ layer: "controller", action: "dashboardHandler", message: "Success", country: country || "initial" });

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Dashboard loaded successfully"));
});

export{dashboardHandler}