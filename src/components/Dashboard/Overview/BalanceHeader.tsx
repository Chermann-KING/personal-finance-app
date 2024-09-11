import React, { useState, useEffect } from "react";

interface BalanceHeaderProps {
  currentBalance: number;
  income: number;
  expenses: number;
}

const BalanceHeader: React.FC<BalanceHeaderProps> = ({
  currentBalance,
  income,
  expenses,
}) => {
  // Formatage des nombres avec une virgule pour les milliers et un point pour les décimales
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  // States pour les valeurs animées
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedExpenses, setAnimatedExpenses] = useState(0);

  // Fonction pour l'animation de comptage
  const animateValue = (
    startValue: number,
    endValue: number,
    duration: number,
    setValue: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const range = endValue - startValue;
    const increment = range / (duration / 16.67); // approx 60 frames per second
    let currentValue = startValue;

    const step = () => {
      currentValue += increment;
      if (
        (increment > 0 && currentValue >= endValue) ||
        (increment < 0 && currentValue <= endValue)
      ) {
        setValue(endValue);
        return;
      }
      setValue(currentValue);
      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  useEffect(() => {
    // Lance l'animation pour chaque valeur avec une durée différente
    animateValue(0, currentBalance, 2500, setAnimatedBalance);
    animateValue(0, income, 2500, setAnimatedIncome);
    animateValue(0, expenses, 2500, setAnimatedExpenses);
  }, [currentBalance, income, expenses]);

  return (
    <div className="w-[1060px] h-[207px] mx-auto flex flex-col justify-between">
      {/* title */}
      <h1 className="text-preset-1 text-grey-900">Overview</h1>

      {/* items */}
      <div className="grid grid-cols-3 gap-6 h-[119px]">
        {/* current balance */}
        <div className="bg-grey-900 w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-white mb-3">Current Balance</h2>
          <p className="text-preset-1 text-white">
            {formatCurrency(animatedBalance)}
          </p>
        </div>
        {/* income */}
        <div className="bg-white w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-grey-500 mb-3">Income</h2>
          <p className="text-preset-1 text-grey-900">
            {formatCurrency(animatedIncome)}
          </p>
        </div>
        {/* expenses */}
        <div className="bg-white w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-grey-500 mb-3">Expenses</h2>
          <p className="text-preset-1 text-grey-900">
            {formatCurrency(animatedExpenses)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceHeader;
