import axios from "axios";
import { ApiError } from "../../utils/ApiError.js";

export const fetchMonetaryFromRBI = async () => {
  try {
    // TODO: Replace with real RBI DBIE endpoint
    const response = await axios.get("RBI_ENDPOINT");

    const data = response.data;

    return {
      policyRate: data.repoRate ?? null,
      moneySupplyM2: data.m3 ?? null,
      domesticCredit: data.bankCredit ?? null,
      bondYield10Y: data.govBondYield ?? null,
      inflation: null,
      industrialProduction: null
    };

  } catch (error) {
    return null; // allow hybrid layer to fallback
  }
};