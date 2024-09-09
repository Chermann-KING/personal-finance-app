import React from "react";

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

  return (
    <div className="w-[1060px] h-[207px] mx-auto flex flex-col justify-between">
      {/* title */}
      <h1 className="text-preset-1 text-grey-900">Overview</h1>

      {/* items */}
      <div className="grid grid-cols-3 gap-4 h-[119px]">
        {/* current balance */}
        <div className="bg-grey-900 w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-white mb-3">Current Balance</h2>
          <p className="text-preset-1 text-white">
            {formatCurrency(currentBalance)}
          </p>
        </div>
        {/* income */}
        <div className="bg-white w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-grey-500 mb-3">Income</h2>
          <p className="text-preset-1 text-grey-900">
            {formatCurrency(income)}
          </p>
        </div>
        {/* expenses */}
        <div className="bg-white w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-grey-500 mb-3">Expenses</h2>
          <p className="text-preset-1 text-grey-900">
            {formatCurrency(expenses)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceHeader;
