import React from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface ExpensesProps {
  expenses: number;
}

export const Expenses = ({ expenses }: ExpensesProps) => {
  const animatedExpenses = useAnimatedNumber(expenses, 2500);
  return (
    <div className="bg-white w-full flex flex-col gap-y-3 p-6 rounded-xl">
      <span className="text-preset-4 text-grey-500">Expenses</span>
      <p className="text-preset-1 font-bold text-grey-900">
        {formatCurrency(animatedExpenses)}
      </p>
    </div>
  );
};
