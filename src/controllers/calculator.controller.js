import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { calculateCompoundInterest } from "../internalServices/calculator.service.js";
import { inflationCalculatorService } from "../internalServices/calculator.service.js";
import { inflationByCountryService} from "../internalServices/calculator.service.js";
import { emiCalculatorService } from "../internalServices/calculator.service.js";
import { investmentFeeCalculatorService } from "../internalServices/calculator.service.js";
import logger from "../utils/logger.js";



const compoundInterestCalculator = asyncHandler(async (req, res) => {

   logger.info({ layer: "controller", action: "compoundInterestCalculator", message: "Request received" });

   const { principal, rate, years, frequency } = req.body;

   const result = calculateCompoundInterest(
      principal,
      rate,
      years,
      frequency
   );

   logger.info({ layer: "controller", action: "compoundInterestCalculator", message: "Success" });

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Compound interest calculated"));

});




const emiCalculator = asyncHandler(async (req, res) => {

   logger.info({ layer: "controller", action: "emiCalculator", message: "Request received" });

   const { principal, rate, years } = req.body;

   const result = emiCalculatorService(principal, rate, years);

   logger.info({ layer: "controller", action: "emiCalculator", message: "Success" });

   return res
      .status(200)
      .json(new ApiResponse(200, result, "EMI calculated successfully"));

});





const inflationCalculator = asyncHandler(async (req, res) => {

  logger.info({ layer: "controller", action: "inflationCalculator", message: "Request received" });

  const result = inflationCalculatorService(req.body);

  logger.info({ layer: "controller", action: "inflationCalculator", message: "Success" });

  return res.status(200).json(
    new ApiResponse(200, result, "Inflation calculated successfully")
  );
});




const inflationByCountry = asyncHandler(async (req, res) => {

  logger.info({ layer: "controller", action: "inflationByCountry", message: "Request received" });

  const result = await inflationByCountryService(req.body);

  logger.info({ layer: "controller", action: "inflationByCountry", message: "Success" });

  return res.status(200).json(
    new ApiResponse(200, result, "Country inflation calculated successfully")
  );
});



const investmentFeeCalculator = asyncHandler(async (req, res) => {

  logger.info({ layer: "controller", action: "investmentFeeCalculator", message: "Request received" });

  const result = investmentFeeCalculatorService(req.body);

  logger.info({ layer: "controller", action: "investmentFeeCalculator", message: "Success" });

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Investment calculation completed successfully"
    )
  );
});

export{
  compoundInterestCalculator,
  emiCalculator,
  inflationCalculator,
  inflationByCountry,
  investmentFeeCalculator
};