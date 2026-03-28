const STOCK_SYMBOLS = {
  US: {
    name: "United States",
    exchanges: {
      nyse: {
        name: "New York Stock Exchange",
        symbol: "DIA" // Dow Jones ETF
      },
      nasdaq: {
        name: "Nasdaq",
        symbol: "QQQ" // Nasdaq ETF
      }
    }
  },

  CN: {
    name: "China",
    exchanges: {
      sse: {
        name: "Shanghai Stock Exchange",
        symbol: "000001.SS"
      },
      szse: {
        name: "Shenzhen Stock Exchange",
        symbol: "399001.SZ"
      }
    }
  },

  JP: {
    name: "Japan",
    exchanges: {
      tse: {
        name: "Tokyo Stock Exchange",
        symbol: "^N225"
      }
    }
  },

  HK: {
    name: "Hong Kong",
    exchanges: {
      hkex: {
        name: "Hong Kong Stock Exchange",
        symbol: "^HSI"
      }
    }
  },

  IN: {
    name: "India",
    exchanges: {
      bse: {
        name: "Bombay Stock Exchange",
        symbol: "^BSESN"
      },
      nse: {
        name: "National Stock Exchange",
        symbol: "^NSEI"
      }
    }
  },

  CA: {
    name: "Canada",
    exchanges: {
      tmx: {
        name: "Toronto Stock Exchange",
        symbol: "^GSPTSE"
      }
    }
  },

  UK: {
    name: "United Kingdom",
    exchanges: {
      lse: {
        name: "London Stock Exchange",
        symbol: "^FTSE"
      }
    }
  },

  SA: {
    name: "Saudi Arabia",
    exchanges: {
      tadawul: {
        name: "Saudi Exchange",
        symbol: "^TASI"
      }
    }
  },

  DE: {
    name: "Germany",
    exchanges: {
      frankfurt: {
        name: "Deutsche Börse",
        symbol: "^GDAXI"
      }
    }
  },

  CH: {
    name: "Switzerland",
    exchanges: {
      six: {
        name: "SIX Swiss Exchange",
        symbol: "^SSMI"
      }
    }
  },

  KR: {
    name: "South Korea",
    exchanges: {
      krx: {
        name: "Korea Exchange",
        symbol: "^KS11"
      }
    }
  },

  TW: {
    name: "Taiwan",
    exchanges: {
      twse: {
        name: "Taiwan Stock Exchange",
        symbol: "^TWII"
      }
    }
  },

  AU: {
    name: "Australia",
    exchanges: {
      asx: {
        name: "Australian Securities Exchange",
        symbol: "^AXJO"
      }
    }
  },

  BR: {
    name: "Brazil",
    exchanges: {
      b3: {
        name: "B3",
        symbol: "^BVSP"
      }
    }
  },

  AE: {
    name: "UAE",
    exchanges: {
      adx: {
        name: "Abu Dhabi Securities Exchange",
        symbol: "ADX"
      }
    }
  },

  ID: {
    name: "Indonesia",
    exchanges: {
      idx: {
        name: "Indonesia Stock Exchange",
        symbol: "^JKSE"
      }
    }
  },

  ES: {
    name: "Spain",
    exchanges: {
      bme: {
        name: "Madrid Stock Exchange",
        symbol: "^IBEX"
      }
    }
  },

  SG: {
    name: "Singapore",
    exchanges: {
      sgx: {
        name: "Singapore Exchange",
        symbol: "^STI"
      }
    }
  },

  RU: {
    name: "Russia",
    exchanges: {
      moex: {
        name: "Moscow Exchange",
        symbol: "IMOEX.ME"
      }
    }
  },

  MX: {
    name: "Mexico",
    exchanges: {
      bmv: {
        name: "Bolsa Mexicana",
        symbol: "^MXX"
      }
    }
  },

  TH: {
    name: "Thailand",
    exchanges: {
      set: {
        name: "Stock Exchange of Thailand",
        symbol: "^SET"
      }
    }
  },

  TR: {
    name: "Turkey",
    exchanges: {
      bist: {
        name: "Borsa Istanbul",
        symbol: "XU100.IS"
      }
    }
  },

  MY: {
    name: "Malaysia",
    exchanges: {
      bursa: {
        name: "Bursa Malaysia",
        symbol: "^KLSE"
      }
    }
  }
};


export{STOCK_SYMBOLS}