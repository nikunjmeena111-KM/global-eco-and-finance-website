import { getCountryMacroData } from "../externalServices/macroIndicators.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const getMacroData = asyncHandler(async (req, res) => {

  logger.info({ layer: "controller", action: "getMacroData", message: "Request received" });

  const { country } = req.query;

  if (!country) {
    logger.error({ layer: "controller", action: "getMacroData", message: "Country missing" });
    throw new ApiError(400, "Country query parameter is required");
  }
 
  const data = await getCountryMacroData(country);

  logger.info({ layer: "controller", action: "getMacroData", message: "Success", country });

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Macro economic data fetched successfully"
    )
  );
});

export { getMacroData };