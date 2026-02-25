// src/seeders/seedCountries195.js
import mongoose from "mongoose";
import dotenv, { configDotenv } from "dotenv";
import { Country } from "../models/country.model.js";

dotenv.config();

const countries = [
  { name: "Afghanistan", code: "AF", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Albania", code: "AL", indexSymbol: null, brokerageAvg: 0.80 },
  { name: "Algeria", code: "DZ", indexSymbol: null, brokerageAvg: 0.80 },
  { name: "Andorra", code: "AD", indexSymbol: null, brokerageAvg: 0.80 },
  { name: "Angola", code: "AO", indexSymbol: null, brokerageAvg: 1.20 },
  { name: "Antigua and Barbuda", code: "AG", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Argentina", code: "AR", indexSymbol: "^MERV", brokerageAvg: 0.80 },
  { name: "Armenia", code: "AM", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Australia", code: "AU", indexSymbol: "^AXJO", brokerageAvg: 0.14 },
  { name: "Austria", code: "AT", indexSymbol: "^ATX", brokerageAvg: 0.22 },
  { name: "Azerbaijan", code: "AZ", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Bahamas", code: "BS", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Bahrain", code: "BH", indexSymbol: "^BAX", brokerageAvg: 0.95 },
  { name: "Bangladesh", code: "BD", indexSymbol: "^DSEX", brokerageAvg: 0.70 },
  { name: "Barbados", code: "BB", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Belarus", code: "BY", indexSymbol: null, brokerageAvg: 1.00 },
  { name: "Belgium", code: "BE", indexSymbol: "^BFX", brokerageAvg: 0.22 },
  { name: "Belize", code: "BZ", indexSymbol: null, brokerageAvg: 1.00 },
  { name: "Benin", code: "BJ", indexSymbol: null, brokerageAvg: 1.20 },
  { name: "Bhutan", code: "BT", indexSymbol: null, brokerageAvg: 1.20 },
  { name: "Bolivia", code: "BO", indexSymbol: null, brokerageAvg: 1.00 },
  { name: "Bosnia and Herzegovina", code: "BA", indexSymbol: null, brokerageAvg: 1.00 },
  { name: "Botswana", code: "BW", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Brazil", code: "BR", indexSymbol: "^BVSP", brokerageAvg: 0.30 },
  { name: "Brunei", code: "BN", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Bulgaria", code: "BG", indexSymbol: "^SOFIX", brokerageAvg: 0.80 },
  { name: "Burkina Faso", code: "BF", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Burundi", code: "BI", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Cabo Verde", code: "CV", indexSymbol: null, brokerageAvg: 1.20 },
  { name: "Cambodia", code: "KH", indexSymbol: "^CSX", brokerageAvg: 1.20 },
  { name: "Cameroon", code: "CM", indexSymbol: null, brokerageAvg: 1.20 },
  { name: "Canada", code: "CA", indexSymbol: "^GSPTSE", brokerageAvg: 0.13 },
  { name: "Central African Republic", code: "CF", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Chad", code: "TD", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Chile", code: "CL", indexSymbol: "^IPSA", brokerageAvg: 0.35 },
  { name: "China", code: "CN", indexSymbol: "000001.SS", brokerageAvg: 0.35 },
  { name: "Colombia", code: "CO", indexSymbol: "^COLCAP", brokerageAvg: 0.40 },
  { name: "Comoros", code: "KM", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Congo (Republic)", code: "CG", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Congo (DRC)", code: "CD", indexSymbol: null, brokerageAvg: 1.50 },
  { name: "Costa Rica", code: "CR", indexSymbol: null, brokerageAvg: 0.80 },
  { name: "Côte d'Ivoire", code: "CI", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Croatia", code: "HR", indexSymbol: "^CROBEX", brokerageAvg: 0.80 },
  { name: "Cuba", code: "CU", indexSymbol: null, brokerageAvg: 2.00 },
  { name: "Cyprus", code: "CY", indexSymbol: "^CYSMMAPA", brokerageAvg: 0.90 },
  { name: "Czechia", code: "CZ", indexSymbol: "^PX", brokerageAvg: 0.35 },
  { name: "Denmark", code: "DK", indexSymbol: "^OMXC20", brokerageAvg: 0.20 },
  { name: "Dominican Republic", code: "DO", indexSymbol: null, brokerageAvg: 0.90 },
  { name: "Egypt", code: "EG", indexSymbol: "^CASE30", brokerageAvg: 0.60 },
  { name: "Estonia", code: "EE", indexSymbol: "^OMXTGI", brokerageAvg: 0.25 },
  { name: "Finland", code: "FI", indexSymbol: "^OMXH25", brokerageAvg: 0.18 },
  { name: "France", code: "FR", indexSymbol: "^FCHI", brokerageAvg: 0.11 },
  { name: "Germany", code: "DE", indexSymbol: "^GDAXI", brokerageAvg: 0.11 },
  { name: "Greece", code: "GR", indexSymbol: "^ATG", brokerageAvg: 0.35 },
  { name: "Hong Kong", code: "HK", indexSymbol: "^HSI", brokerageAvg: 0.17 },
  { name: "Hungary", code: "HU", indexSymbol: "^BUX", brokerageAvg: 0.30 },
  { name: "Iceland", code: "IS", indexSymbol: "^ICEXI", brokerageAvg: 0.40 },
  { name: "India", code: "IN", indexSymbol: "^BSESN", brokerageAvg: 0.15 },
  { name: "Indonesia", code: "ID", indexSymbol: "^JKSE", brokerageAvg: 0.30 },
  { name: "Ireland", code: "IE", indexSymbol: "^ISEQ", brokerageAvg: 0.20 },
  { name: "Israel", code: "IL", indexSymbol: "^TA125.TA", brokerageAvg: 0.30 },
  { name: "Italy", code: "IT", indexSymbol: "FTSEMIB.MI", brokerageAvg: 0.15 },
  { name: "Japan", code: "JP", indexSymbol: "^N225", brokerageAvg: 0.20 },
  { name: "Malaysia", code: "MY", indexSymbol: "^KLSE", brokerageAvg: 0.28 },
  { name: "Mexico", code: "MX", indexSymbol: "^MXX", brokerageAvg: 0.25 },
  { name: "Netherlands", code: "NL", indexSymbol: "^AEX", brokerageAvg: 0.20 },
  { name: "New Zealand", code: "NZ", indexSymbol: "^NZ50", brokerageAvg: 0.20 },
  { name: "Nigeria", code: "NG", indexSymbol: "^NGSEINDEX", brokerageAvg: 1.00 },
  { name: "Norway", code: "NO", indexSymbol: "^OSEBX", brokerageAvg: 0.22 },
  { name: "Pakistan", code: "PK", indexSymbol: "^KSE100", brokerageAvg: 0.60 },
  { name: "Philippines", code: "PH", indexSymbol: "PSEI.PS", brokerageAvg: 0.35 },
  { name: "Poland", code: "PL", indexSymbol: "^WIG20", brokerageAvg: 0.28 },
  { name: "Portugal", code: "PT", indexSymbol: "^PSI20", brokerageAvg: 0.22 },
  { name: "Romania", code: "RO", indexSymbol: "^BETI", brokerageAvg: 0.40 },
  { name: "Russia", code: "RU", indexSymbol: "IMOEX.ME", brokerageAvg: 0.30 },
  { name: "Saudi Arabia", code: "SA", indexSymbol: "TASI.SR", brokerageAvg: 0.27 },
  { name: "Singapore", code: "SG", indexSymbol: "^STI", brokerageAvg: 0.16 },
  { name: "South Africa", code: "ZA", indexSymbol: "^J203.JO", brokerageAvg: 0.18 },
  { name: "South Korea", code: "KR", indexSymbol: "^KS11", brokerageAvg: 0.18 },
  { name: "Spain", code: "ES", indexSymbol: "^IBEX", brokerageAvg: 0.15 },
  { name: "Sri Lanka", code: "LK", indexSymbol: "^CSEALL", brokerageAvg: 0.85 },
  { name: "Sweden", code: "SE", indexSymbol: "^OMX", brokerageAvg: 0.14 },
  { name: "Switzerland", code: "CH", indexSymbol: "^SSMI", brokerageAvg: 0.12 },
  { name: "Taiwan", code: "TW", indexSymbol: "^TWII", brokerageAvg: 0.22 },
  { name: "Thailand", code: "TH", indexSymbol: "^SET.BK", brokerageAvg: 0.30 },
  { name: "Turkey", code: "TR", indexSymbol: "XU100.IS", brokerageAvg: 0.32 },
  { name: "United Kingdom", code: "GB", indexSymbol: "^FTSE", brokerageAvg: 0.12 },
  { name: "United States", code: "US", indexSymbol: "^GSPC", brokerageAvg: 0.10 },
  { name: "Vietnam", code: "VN", indexSymbol: "^VNINDEX", brokerageAvg: 0.45 },

  // Countries without functional stock exchanges remain null
  { name: "North Korea", code: "KP", indexSymbol: null, brokerageAvg: 2.50 },
  { name: "Somalia", code: "SO", indexSymbol: null, brokerageAvg: 2.00 },
  { name: "Vatican City", code: "VA", indexSymbol: null, brokerageAvg: 1.00 }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.mongodb_URL)
    console.log("Connected to MongoDB");

    const del = await Country.deleteMany({});
    console.log("Deleted existing countries:", del.deletedCount);

    const inserted = await Country.insertMany(countries, );
    console.log("Inserted countries count:", inserted.length);

    await mongoose.disconnect();
    console.log("Seeding finished");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed", err);
    process.exit(1);
  }
};

seed();