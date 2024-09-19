import React, { useEffect, useState } from "react";
import BudgetCard from "@/components/Dashboard/Budgets/BudgetCard";
import financialData from "@/data/financialData.json";
import { Budget, Transaction, FinancialData } from "@/types";

interface BudgetWithTransactions extends Budget {
  latestTransactions: Transaction[];
}

export default function BudgetCards() {
  const [budgetsWithTransactions, setBudgetsWithTransactions] = useState<
    BudgetWithTransactions[]
  >([]);

  useEffect(() => {
    // Charge les données depuis le fichier JSON
    const data: FinancialData = financialData;

    // Calcule les budgets avec les transactions associées
    const budgetsWithCalculations: BudgetWithTransactions[] = data.budgets.map(
      (budget) => {
        const categoryTransactions = data.transactions.filter(
          (transaction) => transaction.category === budget.category
        );

        return {
          ...budget,
          latestTransactions: categoryTransactions.slice(0, 3), // Les 3 dernières transactions
        };
      }
    );

    setBudgetsWithTransactions(budgetsWithCalculations);
  }, []);

  return (
    <div className="flex flex-col items-center gap-10">
      {budgetsWithTransactions.map((budget) => (
        <BudgetCard
          key={budget.category}
          category={budget.category}
          maximum={budget.maximum}
          spent={budget.spent ?? 0}
          remaining={budget.remaining ?? 0}
          theme={budget.theme}
          latestTransactions={budget.latestTransactions}
        />
      ))}
    </div>
  );
}
