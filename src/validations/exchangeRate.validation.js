import { query } from "express-validator";

 const exchangeRateValidation = [
  query("from")
    .notEmpty()
    .withMessage("From currency is required")
    .isLength({ min: 3, max: 3 })
    .withMessage("From currency must be a 3-letter code"),

  query("to")
    .notEmpty()
    .withMessage("To currency is required")
    .isLength({ min: 3, max: 3 })
    .withMessage("To currency must be a 3-letter code"),
];

export{exchangeRateValidation}