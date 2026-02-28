import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getInitialDashboard,getCountryDashboard } from "./dashboard.service.js";

export const dashboardHandler = asyncHandler(async (req, res) => {
  const { country } = req.query;

  const data = country
    ? await getCountryDashboard(country)
    : await getInitialDashboard();

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Dashboard loaded successfully"));
});