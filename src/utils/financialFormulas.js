 const compoundInterest = (principal, rate, years, frequency) => {

   const r = rate / 100;

   const amount =
      principal * Math.pow((1 + r / frequency), frequency * years);

   return amount;

};


const calculateEMI = (principal, rate, years) => {

   const monthlyRate = rate / 12 / 100;

   const months = years * 12;

   const emi =
      principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);

   return emi;
};

const calculateInflation = (amount, rate, years) => {
  const r = rate / 100;

  const futureValue = amount * Math.pow(1 + r, years);

  const lossOfValue = futureValue - amount;

  return {
    currentValue: amount,
    futureValue,
    purchasingPowerLoss: lossOfValue,
    inflationRate: rate,
    years
  };
};


export{compoundInterest,calculateEMI,calculateInflation}