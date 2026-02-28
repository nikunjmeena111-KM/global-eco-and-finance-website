// src/constants/fred.series.js

 const FRED_SERIES = {

  "US": {
    policyRate: "FEDFUNDS",
    moneySupplyM2: "M2SL",
    domesticCredit: "TOTCI",
    bondYield10Y: "DGS10",
    inflation: "CPIAUCSL",
    industrialProduction: "INDPRO"
  },

  "CN": {
    policyRate: "IRSTCI01CNM156N",
    moneySupplyM2: "MYAGM2CNM189N",
    domesticCredit: "DCPSCN",
    bondYield10Y: "IRLTLT01CNM156N",
    inflation: "CPALTT01CNM657N",
    industrialProduction: "CHNPROINDMISMEI"
  },

  "JP": {
    policyRate: "IRSTCI01JPM156N",
    moneySupplyM2: "MYAGM2JPM189N",
    domesticCredit: "DCPSJP",
    bondYield10Y: "IRLTLT01JPM156N",
    inflation: "CPALTT01JPM657N",
    industrialProduction: "JPNPROINDMISMEI"
  },

  "DE": {
    policyRate: "IRSTCI01DEM156N",
    moneySupplyM2: "MYAGM2DEM189N",
    domesticCredit: "DCPSDE",
    bondYield10Y: "IRLTLT01DEM156N",
    inflation: "CPALTT01DEM657N",
    industrialProduction: "DEUPROINDMISMEI"
  },

  "IN": {
    policyRate: "IRSTCI01INM156N",
    moneySupplyM2: "MYAGM2INM189N",
    domesticCredit: "DCPSIN",
    bondYield10Y: "IRLTLT01INM156N",
    inflation: "CPALTT01INM657N",
    industrialProduction: "INDPROINM"
  },

  "GB": {
    policyRate: "IRSTCI01GBM156N",
    moneySupplyM2: "MYAGM2GBM189N",
    domesticCredit: "DCPSGB",
    bondYield10Y: "IRLTLT01GBM156N",
    inflation: "CPALTT01GBM657N",
    industrialProduction: "GBRPROINDMISMEI"
  },

  "FR": {
    policyRate: "IRSTCI01FRM156N",
    moneySupplyM2: "MYAGM2FRM189N",
    domesticCredit: "DCPSFR",
    bondYield10Y: "IRLTLT01FRM156N",
    inflation: "CPALTT01FRM657N",
    industrialProduction: "FRAPROINDMISMEI"
  },

  "IT": {
    policyRate: "IRSTCI01ITM156N",
    moneySupplyM2: "MYAGM2ITM189N",
    domesticCredit: "DCPSIT",
    bondYield10Y: "IRLTLT01ITM156N",
    inflation: "CPALTT01ITM657N",
    industrialProduction: "ITAPROINDMISMEI"
  },

  "CA": {
    policyRate: "IRSTCI01CAM156N",
    moneySupplyM2: "MYAGM2CAM189N",
    domesticCredit: "DCPSCA",
    bondYield10Y: "IRLTLT01CAM156N",
    inflation: "CPALTT01CAM657N",
    industrialProduction: "CANPROINDMISMEI"
  },

  "KR": {
    policyRate: "IRSTCI01KRM156N",
    moneySupplyM2: "MYAGM2KRM189N",
    domesticCredit: "DCPSKR",
    bondYield10Y: "IRLTLT01KRM156N",
    inflation: "CPALTT01KRM657N",
    industrialProduction: "KORPROINDMISMEI"
  },

  // 🇧🇷 Brazil
  "BR": {
    policyRate: "IRSTCI01BRM156N",
    moneySupplyM2: "MYAGM2BRM189N",
    domesticCredit: "DCPSBR",
    bondYield10Y: "IRLTLT01BRM156N",
    inflation: "CPALTT01BRM657N",
    industrialProduction: "BRAPROINDMISMEI"
  },

  // 🇦🇺 Australia
  "AU": {
    policyRate: "IRSTCI01AUM156N",
    moneySupplyM2: "MYAGM2AUM189N",
    domesticCredit: "DCPSAU",
    bondYield10Y: "IRLTLT01AUM156N",
    inflation: "CPALTT01AUM657N",
    industrialProduction: "AUSPROINDMISMEI"
  },

  // 🇪🇸 Spain
  "ES": {
    policyRate: "IRSTCI01ESM156N",
    moneySupplyM2: "MYAGM2ESM189N",
    domesticCredit: "DCPSES",
    bondYield10Y: "IRLTLT01ESM156N",
    inflation: "CPALTT01ESM657N",
    industrialProduction: "ESPPROINDMISMEI"
  },

  // 🇳🇱 Netherlands
  "NL": {
    policyRate: "IRSTCI01NLM156N",
    moneySupplyM2: "MYAGM2NLM189N",
    domesticCredit: "DCPSNL",
    bondYield10Y: "IRLTLT01NLM156N",
    inflation: "CPALTT01NLM657N",
    industrialProduction: "NLDPORINDMISMEI"
  },

  // 🇨🇭 Switzerland
  "CH": {
    policyRate: "IRSTCI01CHM156N",
    moneySupplyM2: "MYAGM2CHM189N",
    domesticCredit: "DCPSCH",
    bondYield10Y: "IRLTLT01CHM156N",
    inflation: "CPALTT01CHM657N",
    industrialProduction: "CHEPROINDMISMEI"
  },

  // 🇷🇺 Russia
  "RU": {
    policyRate: "IRSTCI01RUM156N",
    moneySupplyM2: "MYAGM2RUM189N",
    domesticCredit: "DCPSRU",
    bondYield10Y: "IRLTLT01RUM156N",
    inflation: "CPALTT01RUM657N",
    industrialProduction: "RUSPROINDMISMEI"
  },

  // 🇲🇽 Mexico
  "MX": {
    policyRate: "IRSTCI01MXM156N",
    moneySupplyM2: "MYAGM2MXM189N",
    domesticCredit: "DCPSMX",
    bondYield10Y: "IRLTLT01MXM156N",
    inflation: "CPALTT01MXM657N",
    industrialProduction: "MEXPROINDMISMEI"
  },

  // 🇸🇬 Singapore
  "SG": {
    policyRate: "IRSTCI01SGM156N",
    moneySupplyM2: "MYAGM2SGM189N",
    domesticCredit: "DCPSSG",
    bondYield10Y: "IRLTLT01SGM156N",
    inflation: "CPALTT01SGM657N",
    industrialProduction: "SGPPROINDMISMEI"
  },

  // 🇿🇦 South Africa
  "ZA": {
    policyRate: "IRSTCI01ZAM156N",
    moneySupplyM2: "MYAGM2ZAM189N",
    domesticCredit: "DCPSZA",
    bondYield10Y: "IRLTLT01ZAM156N",
    inflation: "CPALTT01ZAM657N",
    industrialProduction: "ZAFPROINDMISMEI"
  },

  // 🇹🇷 Türkiye
  "TR": {
    policyRate: "IRSTCI01TRM156N",
    moneySupplyM2: "MYAGM2TRM189N",
    domesticCredit: "DCPSTR",
    bondYield10Y: "IRLTLT01TRM156N",
    inflation: "CPALTT01TRM657N",
    industrialProduction: "TURPROINDMISMEI"
  }

};

export{FRED_SERIES}