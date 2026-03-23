const INVESTMENT_RULES = {
  equity: {
    resident: {
      brokerage: 0.3,

      stt: {
        buy: 0.1,
        sell: 0.1
      },

      stampDuty: {
        buy: 0.015,
        sell: 0
      },

      exchangeCharges: 0.00325,
      sebiCharges: 0.0001,

      stcgTax: 20,
      ltcgTax: 12.5
    },

    nri: {
      brokerage: 0.75,

      stt: {
        buy: 0.1,
        sell: 0.1
      },

      stampDuty: {
        buy: 0.015,
        sell: 0
      },

      exchangeCharges: 0.00325,
      sebiCharges: 0.0001,

      stcgTax: 20,
      ltcgTax: 12.5,

      tdsStcg: 20,
      tdsLtcg: 12.5,

      pisYearlyFee: 1000
    }
  },

  fno: {
    resident: {
      brokeragePerOrder: 20,   // ₹

      stt: {
        futures: {
          buy: 0,
          sell: 0.01
        },
        options: {
          buy: 0,
          sell: 0.0625
        }
      },

      stampDuty: {
        buy: 0.003,
        sell: 0
      },

      exchangeCharges: 0.002,
      sebiCharges: 0.0001,

      taxType: "businessIncome"
    },

    nri: {
      brokeragePerOrder: 50,

      stt: {
        futures: {
          buy: 0,
          sell: 0.01
        },
        options: {
          buy: 0,
          sell: 0.0625
        }
      },

      stampDuty: {
        buy: 0.003,
        sell: 0
      },

      exchangeCharges: 0.002,
      sebiCharges: 0.0001,

      taxType: "businessIncome"
    }
  },

  mutualFund: {
    resident: {
      expenseRatio: 2.25,
      stampDuty: 0.005,
      exitLoad: 1,

      stcgTax: 20,
      ltcgTax: 12.5
    },

    nri: {
      expenseRatio: 2.25,
      stampDuty: 0.005,
      exitLoad: 1,

      stcgTax: 20,
      ltcgTax: 12.5,

      tdsStcg: 20,
      tdsLtcg: 12.5
    }
  },

  fixedIncome: {
    resident: {
      tdsThreshold: 40000,
      tds: 10,
      taxSlab: 30
    },

    nri: {
      nroTds: 30,
      nreTds: 0
    }
  },

  gold: {
    resident: {
      stcgTax: 30,
      ltcgTax: 12.5
    },

    nri: {
      stcgTax: 30,
      ltcgTax: 12.5,

      tdsStcg: 30,
      tdsLtcg: 12.5
    }
  }
};

export {INVESTMENT_RULES}