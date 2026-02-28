import axios from "axios";
import { Country } from "../models/country.model.js";
import { ApiError } from "../utils/ApiError.js";

 const getCountryData = async (code) => {
  if (!code) {
    throw new ApiError(400, "Country code is required");
  }

  const upperCode = code.toUpperCase();

  // Fetch from DB (MANDATORY)
  const country = await Country.findOne({ code: upperCode });

  if (!country) {
    throw new ApiError(404, "Country not found in database");
  }

  //  Try external API (OPTIONAL ENRICHMENT)
  let name = country.name; // fallback to DB name
  let flag = "";
  let currency = "N/A";

  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${upperCode}`
    );

    const countryAPIData = response.data[0];

    name = countryAPIData?.name?.common || country.name;
    flag = countryAPIData?.flags?.png || "";
    currency = countryAPIData?.currencies
      ? Object.keys(countryAPIData.currencies)[0]
      : "N/A";

  } catch (error) {
    // ❗ DO NOT THROW
    // External failure should NOT break system
    console.warn("External country API failed, using DB fallback.");
  }

  return {
    name,
    flag,
    currency,
    indexSymbol: country.indexSymbol,
    investment: {
      capitalGainsTax: country.capitalGainsTax,
      dividendTax: country.dividendTax,
      brokerageAvg: country.brokerageAvg,
    }
  };
};

 const getCountryList = async () => {
  return await Country.find(
    {},
    { name: 1, code: 1, _id: 0 } // projection (only name & code)
  );
};

export {getCountryData, getCountryList}