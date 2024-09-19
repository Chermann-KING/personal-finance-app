import React from "react";
import BudgetCard from "@/components/Dashboard/Budgets/BudgetCard";
import { useBudget } from "@/context/BudgetContext";

export default function BudgetCards() {
  const { budgets, transactions } = useBudget();

  return (
    <div className="flex flex-col items-center gap-10">
      {budgets.map((budget) => {
        const categoryTransactions = transactions.filter(
          (transaction) => transaction.category === budget.category
        );
        return (
          <BudgetCard
            key={budget.category}
            category={budget.category}
            maximum={budget.maximum}
            spent={budget.spent ?? 0}
            remaining={budget.remaining ?? 0}
            theme={budget.theme}
            latestTransactions={categoryTransactions.slice(0, 3)}
          />
        );
      })}
    </div>
  );
}
