import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface CurrentBalanceProps {
  currentBalance: number;
}

export const CurrentBalance = ({ currentBalance }: CurrentBalanceProps) => {
  const animatedBalance = useAnimatedNumber(currentBalance, 2500);
  return (
    <div className="bg-grey-900 w-full flex flex-col gap-y-3 p-6 rounded-xl">
      <span className="text-preset-4 text-white">Current Balance</span>
      <p className="text-preset-1 font-bold text-white">
        {formatCurrency(animatedBalance)}
      </p>
    </div>
  );
};
