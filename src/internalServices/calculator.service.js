import { compoundInterest } from "../utils/financialFormulas.js";
import { calculateEMI } from "../utils/financialFormulas.js";
import { calculateInflation } from "../utils/financialFormulas.js";
import { getCountryMacroData } from "../externalServices/macroIndicators.service.js";
import { INVESTMENT_RULES } from "../constants/investmentRules.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";


const calculateCompoundInterest = (
   principal,
   rate,
   years,
   frequency
  ) => {

   logger.debug({ layer: "service", service: "compoundInterest", message: "Calculation started" });

   const finalAmount = compoundInterest(
      principal,
      rate,
      years,
      frequency
   );

   const interestEarned = finalAmount - principal;

   logger.debug({ layer: "service", service: "compoundInterest", message: "Calculation completed" });

   return {
      principal,
      rate,
      years,
      frequency,
      finalAmount: Number(finalAmount.toFixed(2)),
      interestEarned: Number(interestEarned.toFixed(2))
   };

};




const emiCalculatorService = (principal, rate, years) => {

   logger.debug({ layer: "service", service: "emiCalculator", message: "Calculation started" });

   const emi = calculateEMI(principal, rate, years);

   const months = years * 12;

   const totalPayment = emi * months;

   const totalInterest = totalPayment - principal;

   logger.debug({ layer: "service", service: "emiCalculator", message: "Calculation completed" });

   return {
      principal,
      rate,
      years,
      monthlyEMI: Number(emi.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalInterest: Number(totalInterest.toFixed(2))
   };

};




const inflationCalculatorService = ({ amount, rate, years }) => {

  logger.debug({ layer: "service", service: "inflationCalculator", message: "Calculation started" });

  const result = calculateInflation(amount, rate, years);

  logger.debug({ layer: "service", service: "inflationCalculator", message: "Calculation completed" });

  return result;
};




const inflationByCountryService = async ({ country, amount, years, targetYear }) => {

  logger.debug({ layer: "service", service: "inflationByCountry", message: "Fetching macro data", country });

  const macroData = await getCountryMacroData(country);

  const inflationArray = macroData?.macro?.INFLATION;

  if (!inflationArray || inflationArray.length === 0) {
    logger.error({ layer: "service", service: "inflationByCountry", message: "Inflation data not available", country });
    throw new ApiError(404, "Inflation data not available");
  }

 let inflationRate;
 let selectedYear;

 if (targetYear) {
  const yearData = inflationArray.find(
    (item) => item.year === targetYear
  );

  if (!yearData) {
    logger.error({ layer: "service", service: "inflationByCountry", message: "Year data not found", targetYear });
    throw new ApiError(404, "Inflation data not available for selected year");
  }

  inflationRate = yearData.value;
  selectedYear = yearData.year;

  } else {
  const latestData = inflationArray.reduce((latest, curr) =>
    curr.year > latest.year ? curr : latest
  );

  inflationRate = latestData.value;
  selectedYear = latestData.year;
 }

 const result = calculateInflation(amount, inflationRate, years);

 logger.debug({ layer: "service", service: "inflationByCountry", message: "Calculation completed", country });

 return {
  country,
  selectedYear,
  inflationRate,
  ...result
 };
}





// ===============================
// HELPER: AUTO TAX SLAB
// ===============================
const getTaxSlab = (income) => {
  if (income <= 300000) return 0;
  if (income <= 600000) return 5;
  if (income <= 900000) return 10;
  if (income <= 1200000) return 15;
  if (income <= 1500000) return 20;
  return 30;
};

const investmentFeeCalculatorService = (data) => {

  logger.debug({ layer: "service", service: "investmentCalculator", message: "Calculation started", type: data.investmentType });

  const {
    investmentType,
    residency,
    amount,
    expectedReturn,
    years,
    transactionType,
    instrumentType
  } = data;

  if (!INVESTMENT_RULES[investmentType]) {
    logger.error({ layer: "service", service: "investmentCalculator", message: "Invalid investment type" });
    throw new ApiError(400, "Invalid investment type");
  }

  const rules = INVESTMENT_RULES[investmentType][residency];

  if (!rules) {
    logger.error({ layer: "service", service: "investmentCalculator", message: "Invalid residency" });
    throw new ApiError(400, "Invalid residency");
  }

  if (!amount || amount <= 0) {
    logger.error({ layer: "service", service: "investmentCalculator", message: "Invalid amount" });
    throw new ApiError(400, "Valid amount required");
  }

  if (!transactionType) {
    logger.error({ layer: "service", service: "investmentCalculator", message: "Transaction type missing" });
    throw new ApiError(400, "Transaction type required");
  }

  let totalCharges = 0;
  let breakdown = {};

  if (investmentType === "equity" || investmentType === "fno") {
    let stt = 0;
    let stampDuty = 0;
    let brokerage = 0;

    if (investmentType === "equity") {
      stt = rules.stt[transactionType];
      stampDuty = rules.stampDuty[transactionType];
      brokerage = (rules.brokerage / 100) * amount;
    }

    if (investmentType === "fno") {
      if (!instrumentType) {
        logger.error({ layer: "service", service: "investmentCalculator", message: "Instrument type missing" });
        throw new ApiError(400, "Instrument type required");
      }

      stt = rules.stt[instrumentType][transactionType];
      stampDuty = rules.stampDuty[transactionType];
      brokerage = rules.brokeragePerOrder;
    }

    const sttAmount = (stt / 100) * amount;
    const stampDutyAmount = (stampDuty / 100) * amount;

    const exchangeCharges = (rules.exchangeCharges / 100) * amount;
    const sebiCharges = (rules.sebiCharges / 100) * amount;

    totalCharges =
      sttAmount +
      stampDutyAmount +
      brokerage +
      exchangeCharges +
      sebiCharges;

    breakdown = {
      stt: Math.round(sttAmount),
      stampDuty: Math.round(stampDutyAmount),
      brokerage: Math.round(brokerage),
      exchangeCharges: Math.round(exchangeCharges),
      sebiCharges: Math.round(sebiCharges)
    };
  }

  if (investmentType === "mutualFund") {
    const expense = (rules.expenseRatio / 100) * amount * years;
    const stampDuty = (rules.stampDuty / 100) * amount;

    totalCharges = expense + stampDuty;

    breakdown = {
      expenseRatio: Math.round(expense),
      stampDuty: Math.round(stampDuty)
    };
  }

  let finalValue = amount;
  let profit = 0;

  if (expectedReturn && years) {
    const r = expectedReturn / 100;
    finalValue = amount * Math.pow(1 + r, years);
    profit = finalValue - amount;
  }

  let tax = 0;
  let taxType = "none";

  if (
    investmentType === "equity" ||
    investmentType === "mutualFund" ||
    investmentType === "gold"
  ) {
    if (years < 1) {
      taxType = "STCG";
      tax = (rules.stcgTax / 100) * profit;
    } else {
      taxType = "LTCG";

      const exemption = 125000;
      const taxableProfit = profit - exemption;

      if (taxableProfit > 0) {
        tax = (rules.ltcgTax / 100) * taxableProfit;
      } else {
        tax = 0;
      }
    }
  }

  if (investmentType === "fno") {
    taxType = "businessIncome";
    const slab = getTaxSlab(profit);
    tax = (slab / 100) * profit;
  }

  if (investmentType === "fixedIncome") {
    taxType = "slab";
    const slab = getTaxSlab(profit);
    tax = (slab / 100) * profit;
  }

  const cess = 0.04 * tax;
  tax = tax + cess;

  const netProfitBeforeTax = profit - totalCharges;
  const netProfitAfterTax = netProfitBeforeTax - tax;

  logger.debug({ layer: "service", service: "investmentCalculator", message: "Calculation completed" });

  return {
    message: "Investment calculation completed",

    breakdown,
    totalCharges: Math.round(totalCharges),

    returns: {
      finalValue: Math.round(finalValue),
      profit: Math.round(profit),
      netProfitBeforeTax: Math.round(netProfitBeforeTax)
    },

    tax: {
      type: taxType,
      amount: Math.round(tax),
      cessIncluded: true
    },

    final: {
      netProfitAfterTax: Math.round(netProfitAfterTax)
    }
  };
};
  

export{
  calculateCompoundInterest,
  emiCalculatorService,
  inflationCalculatorService,
  inflationByCountryService,
  investmentFeeCalculatorService
};