import { getCountryMacroData } from "../externalServices/macroIndicators.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getMacroData = asyncHandler(async (req, res) => {
  const { country } = req.query;

  if (!country) {
    throw new ApiError(400, "Country query parameter is required");
  }
 
  const data = await getCountryMacroData(country);

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Macro economic data fetched successfully"
    )
  );
});

export { getMacroData };