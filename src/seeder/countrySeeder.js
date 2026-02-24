// src/seed/country.seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import  {Country}  from "../models/country.model.js";

dotenv.config();

// Top ~50 economies (country names & ISO codes based on IMF/World Bank aggregated lists).
// NOTE: indexSymbol, capitalGainsTax, dividendTax, brokerageAvg are best-effort / placeholder values.
// Verify tax & brokerage fields per-country later and replace as needed.
const countries = [
  { name: "United States", code: "US", indexSymbol: "^GSPC", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.05%" },
  { name: "China", code: "CN", indexSymbol: "000001.SS", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Japan", code: "JP", indexSymbol: "^N225", capitalGainsTax: "20% (approx)", dividendTax: "15% (approx)", brokerageAvg: "0.10%" },
  { name: "Germany", code: "DE", indexSymbol: "^GDAXI", capitalGainsTax: "25% (approx)", dividendTax: "25% (approx)", brokerageAvg: "0.20%" },
  { name: "India", code: "IN", indexSymbol: "^NSEI", capitalGainsTax: "15% (approx)", dividendTax: "10% (approx)", brokerageAvg: "0.30%" },
  { name: "United Kingdom", code: "GB", indexSymbol: "^FTSE", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.15%" },
  { name: "France", code: "FR", indexSymbol: "^FCHI", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Italy", code: "IT", indexSymbol: "FTSEMIB.MI", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Canada", code: "CA", indexSymbol: "^GSPTSE", capitalGainsTax: "50% inclusion (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.10%" },
  { name: "Russia", code: "RU", indexSymbol: "IMOEX.ME", capitalGainsTax: "13% (approx)", dividendTax: "13% (approx)", brokerageAvg: "0.20%" },

  { name: "South Korea", code: "KR", indexSymbol: "^KS11", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.15%" },
  { name: "Australia", code: "AU", indexSymbol: "^AXJO", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.10%" },
  { name: "Spain", code: "ES", indexSymbol: "^IBEX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Mexico", code: "MX", indexSymbol: "^MXX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Indonesia", code: "ID", indexSymbol: "^JKSE", capitalGainsTax: "10% (approx)", dividendTax: "10% (approx)", brokerageAvg: "0.30%" },
  { name: "Netherlands", code: "NL", indexSymbol: "^AEX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.15%" },
  { name: "Saudi Arabia", code: "SA", indexSymbol: "^TASI", capitalGainsTax: "0% (often)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Turkey", code: "TR", indexSymbol: "XU100.IS", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Switzerland", code: "CH", indexSymbol: "^SSMI", capitalGainsTax: "0% (often for individuals)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.15%" },
  { name: "Taiwan", code: "TW", indexSymbol: "^TWII", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.15%" },

  { name: "Poland", code: "PL", indexSymbol: "WIG20.WA", capitalGainsTax: "19% (approx)", dividendTax: "19% (approx)", brokerageAvg: "0.25%" },
  { name: "Sweden", code: "SE", indexSymbol: "^OMX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Belgium", code: "BE", indexSymbol: "^BFX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Argentina", code: "AR", indexSymbol: "^MERV", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Thailand", code: "TH", indexSymbol: "^SET.BK", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Iran", code: "IR", indexSymbol: "TEDPIX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Norway", code: "NO", indexSymbol: "^OSEAX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "UAE", code: "AE", indexSymbol: "DFMGI", capitalGainsTax: "0% (often)", dividendTax: "0% (often)", brokerageAvg: "0.20%" },
  { name: "Israel", code: "IL", indexSymbol: "^TA125", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "South Africa", code: "ZA", indexSymbol: "^JN0U.JO", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },

  { name: "Singapore", code: "SG", indexSymbol: "^STI", capitalGainsTax: "0% (often)", dividendTax: "0% (often)", brokerageAvg: "0.15%" },
  { name: "Malaysia", code: "MY", indexSymbol: "^KLSE", capitalGainsTax: "0% (often)", dividendTax: "0% (often)", brokerageAvg: "0.20%" },
  { name: "Philippines", code: "PH", indexSymbol: "^PSEI", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Egypt", code: "EG", indexSymbol: "EGX30.CA", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Bangladesh", code: "BD", indexSymbol: "DSEX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Pakistan", code: "PK", indexSymbol: "^KSE", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Vietnam", code: "VN", indexSymbol: "^VNINDEX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },
  { name: "Chile", code: "CL", indexSymbol: "^IPSA", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Colombia", code: "CO", indexSymbol: "^COLCAP", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Nigeria", code: "NG", indexSymbol: "^NGSEINDEX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.30%" },

  { name: "Denmark", code: "DK", indexSymbol: "^OMXC20", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Finland", code: "FI", indexSymbol: "^OMXH25", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Austria", code: "AT", indexSymbol: "^ATX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Ireland", code: "IE", indexSymbol: "^ISEQ", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Portugal", code: "PT", indexSymbol: "^PSI20", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" },
  { name: "Greece", code: "GR", indexSymbol: "ATG.AT", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Hungary", code: "HU", indexSymbol: "^BUX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Czech Republic", code: "CZ", indexSymbol: "PX.PR", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "Romania", code: "RO", indexSymbol: "BET.BX", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.25%" },
  { name: "New Zealand", code: "NZ", indexSymbol: "^NZ50", capitalGainsTax: "Varies (placeholder)", dividendTax: "Varies (placeholder)", brokerageAvg: "0.20%" }
];

const seedCountries = async () => {
  try {
    const mongoURI = process.env.mongodb_URL ;
    if (!mongoURI) throw new Error("mongoDB_URL not found in .env");

    await mongoose.connect(mongoURI);

    // Clear old documents for a clean seed (safe for development)
    await Country.deleteMany();

    // Insert all countries (upsert approach could be used instead)
    await Country.insertMany(countries);

    console.log(" Top ~50 economies seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Seeding failed:", error);
    process.exit(1);
  }
};

seedCountries();