import { query } from "express-validator";

const countryDashboardValidation = [
  query("country")
    .optional()
    .isString()
    .withMessage("Country must be a valid string"),
];

export{countryDashboardValidation}