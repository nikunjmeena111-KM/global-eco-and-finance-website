import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { calculateCompoundInterest } from "../internalServices/calculator.service.js";
import { inflationCalculatorService } from "../internalServices/calculator.service.js";
import { inflationByCountryService} from "../internalServices/calculator.service.js";
import { emiCalculatorService } from "../internalServices/calculator.service.js";
import { investmentFeeCalculatorService } from "../internalServices/calculator.service.js";



const compoundInterestCalculator = asyncHandler(async (req, res) => {

   const { principal, rate, years, frequency } = req.body;

   const result = calculateCompoundInterest(
      principal,
      rate,
      years,
      frequency
   );

   return res
      .status(200)
      .json(new ApiResponse(200, result, "Compound interest calculated"));

});




const emiCalculator = asyncHandler(async (req, res) => {

   const { principal, rate, years } = req.body;

   const result = emiCalculatorService(principal, rate, years);

   return res
      .status(200)
      .json(new ApiResponse(200, result, "EMI calculated successfully"));

});





const inflationCalculator = asyncHandler(async (req, res) => {
  const result = inflationCalculatorService(req.body);

  return res.status(200).json(
    new ApiResponse(200, result, "Inflation calculated successfully")
  );
});




const inflationByCountry = asyncHandler(async (req, res) => {
  const result = await inflationByCountryService(req.body);

  return res.status(200).json(
    new ApiResponse(200, result, "Country inflation calculated successfully")
  );
});



const investmentFeeCalculator = asyncHandler(async (req, res) => {
  const result = investmentFeeCalculatorService(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Investment calculation completed successfully"
    )
  );
});

export{compoundInterestCalculator,emiCalculator,inflationCalculator,inflationByCountry,investmentFeeCalculator}