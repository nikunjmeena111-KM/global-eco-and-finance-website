import express from "express";
import { compoundInterestCalculator } from "../controllers/calculator.controller.js";
import { compoundInterestValidation } from "../validations/calculator.validation.js";
import { emiCalculator } from "../controllers/calculator.controller.js";
import { emiValidation } from "../validations/calculator.validation.js";
import {inflationByCountry} from "../controllers/calculator.controller.js";
import {inflationCountryValidation} from "../validations/calculator.validation.js";
import { inflationCalculator } from "../controllers/calculator.controller.js";
import { inflationValidation } from "../validations/calculator.validation.js";
import { investmentFeeCalculator } from "../controllers/calculator.controller.js";
import { investmentCalculatorValidation } from "../validations/calculator.validation.js";

import { validate } from "../middlewares/inputValidation.middleware.js";

const router = express.Router();

router.post( "/compound-interest",compoundInterestValidation,validate,compoundInterestCalculator);

router.post("/emi",emiValidation,validate,emiCalculator);

router.post("/inflation/country",inflationCountryValidation,validate,inflationByCountry);

router.post("/inflation",inflationValidation,validate,inflationCalculator);

router.post("/investment",investmentCalculatorValidation,validate,investmentFeeCalculator);

export default router;