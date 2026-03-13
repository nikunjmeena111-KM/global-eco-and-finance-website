import { query } from "express-validator";

const macroDataValidation = [
  query("country")
    .notEmpty()
    .withMessage("Country name is required")
    .isString()
    .withMessage("Country must be a valid string"),
];

export{macroDataValidation}