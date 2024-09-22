import React, { FC } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { CurrentBalance } from "./CurrentBalance";

interface BalanceHeaderProps {
  currentBalance: number;
  income: number;
  expenses: number;
}

const BalanceHeader: FC<BalanceHeaderProps> = ({
  currentBalance,
  income,
  expenses,
}) => {
  // Utilisation du custom hook pour animer les valeurs
  const animatedBalance = useAnimatedNumber(currentBalance, 2500);
  const animatedIncome = useAnimatedNumber(income, 2500);
  const animatedExpenses = useAnimatedNumber(expenses, 2500);

  return (
    <div className="w-[1060px] h-[207px] mx-auto flex flex-col justify-between">
      {/* title */}
      <h1 className="text-preset-1 text-grey-900">Overview</h1>

      {/* items */}
      <div className="grid grid-cols-3 gap-6 h-[119px]">
        {/* current balance */}
        {/* <div className="bg-grey-900 w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-white mb-3">Current Balance</h2>
          <p className="text-preset-1 text-white">
            {formatCurrency(animatedBalance)}
          </p>
        </div> */}
        {/* <CurrentBalance currentBalance={}/> */}
        {/* income */}
        {/* <div className="bg-white w-full p-6 rounded-xl">
          <h2 className="text-preset-4 text-grey-500 mb-3">Income</h2>
          <p className="text-preset-1 text-grey-900">
            {formatCurrency(animatedIncome)}
          </p>
        </div> */}
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
