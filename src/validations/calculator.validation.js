import { body } from "express-validator";

const compoundInterestValidation = [
   body("principal")
      .isFloat({ gt: 0 })
      .withMessage("Principal must be greater than 0"),

   body("rate")
      .isFloat({ gt: 0 })
      .withMessage("Rate must be greater than 0"),

   body("years")
      .isFloat({ gt: 0 })
      .withMessage("Years must be greater than 0"),

   body("frequency")
      .isInt({ gt: 0 })
      .withMessage("Frequency must be greater than 0")
];


const emiValidation = [
   body("principal")
      .isFloat({ gt: 0 })
      .withMessage("Principal must be greater than 0"),

   body("rate")
      .isFloat({ gt: 0 })
      .withMessage("Interest rate must be greater than 0"),

   body("years")
      .isInt({ gt: 0 })
      .withMessage("Years must be greater than 0")
];

const inflationValidation = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("rate")
    .isFloat({ gt: 0 })
    .withMessage("Rate must be greater than 0"),

  body("years")
    .isInt({ gt: 0, lt: 101 })
    .withMessage("Years must be between 1 and 100")
];

const inflationCountryValidation = [
  body("country")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("years")
    .isInt({ gt: 0, lt: 101 })
    .withMessage("Years must be between 1 and 100"),
   
  body("targetYear")
  .optional()
  .isInt({ gt: 1900 })
  .withMessage("Invalid year")
];



const investmentCalculatorValidation = [
  // investment type
  body("investmentType")
    .notEmpty()
    .withMessage("Investment type is required")
    .isIn(["equity", "fno", "mutualFund", "fixedIncome", "gold"])
    .withMessage("Invalid investment type"),

  // residency
  body("residency")
    .notEmpty()
    .withMessage("Residency is required")
    .isIn(["resident", "nri"])
    .withMessage("Invalid residency"),

  // amount
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  // expected return
  body("expectedReturn")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Expected return must be positive"),

  // years
  body("years")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Years must be greater than 0"),

  // transaction type
  body("transactionType")
    .notEmpty()
    .withMessage("Transaction type is required")
    .isIn(["buy", "sell"])
    .withMessage("Transaction type must be buy or sell"),

  // F&O instrument type (conditional)
  body("instrumentType")
    .optional()
    .isIn(["futures", "options"])
    .withMessage("Instrument must be futures or options")
];

export{compoundInterestValidation,emiValidation,inflationValidation,inflationCountryValidation,investmentCalculatorValidation}