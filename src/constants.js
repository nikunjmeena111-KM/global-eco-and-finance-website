 const DB_Name= "financialData"

 const INDICATORS = {
  GDP: {
    code: "NY.GDP.MKTP.CD",
    name: "GDP (current US$)",
  },
  GDP_GROWTH: {
    code: "NY.GDP.MKTP.KD.ZG",
    name: "GDP Growth (%)",
  }, 
  INFLATION: {
    code: "FP.CPI.TOTL.ZG",
    name: "Inflation (CPI %)",
  },
  UNEMPLOYMENT: {
    code: "SL.UEM.TOTL.ZS",
    name: "Unemployment (%)",
  },
};

export{DB_Name,INDICATORS}