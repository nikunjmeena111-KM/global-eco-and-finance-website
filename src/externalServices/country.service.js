import axios from "axios";
import { Country } from "../models/country.model.js";
import { ApiError } from "../utils/ApiError.js";

 const getCountryData = async (code) => {
  if (!code) {
    throw new ApiError(400, "Country code is required");
  }

  const upperCode = code.toUpperCase();

  // Fetch from DB
  const country = await Country.findOne({ code: upperCode });

  if (!country) {
    throw new ApiError(404, "Country not found in database");
  }

  // 2Fetch from REST Countries API
  let countryAPIData;

  try {
    const response = await axios.get(
      `https://restcountries.com/v3.1/alpha/${upperCode}`
    );

    countryAPIData = response.data[0];
  } catch (error) {
    throw new ApiError(500, "Failed to fetch country data from external API");
  }

  //  Extract required fields safely
  const name = countryAPIData?.name?.common || "N/A";
  const flag = countryAPIData?.flags?.png || "";
  const currency = countryAPIData?.currencies
    ? Object.keys(countryAPIData.currencies)[0]
    : "N/A";

  //  Return merged structured object
  return {
    name,
    flag,
    currency,
    indexSymbol: country.indexSymbol,
    investment: {
      capitalGainsTax: country.capitalGainsTax,
      dividendTax: country.dividendTax,
      brokerageAvg: country.brokerageAvg
    }
  };
};

export {getCountryData}