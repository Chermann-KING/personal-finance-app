"use client";
import { useEffect, useState } from "react";
import { useBudget } from "@/context/BudgetContext";
import TransactionsList from "@/components/Dashboard/Transactions/TransactionsList";
import { Transaction } from "@/types";
import { BudgetProvider } from "@/context/BudgetContext";

interface Props {
  params: { category: string };
}

function BudgetTransactionsPage({ params }: Props) {
  const { category } = params;
  const { budgets } = useBudget();
  const [budgetTransactions, setBudgetTransactions] = useState<Transaction[]>(
    []
  );

  useEffect(() => {
    if (category && budgets.length > 0) {
      // Trouver le budget correspondant à la catégorie
      const normalizedCategory = category.replace(/-/g, " ").toLowerCase();
      const budget = budgets.find(
        (budget) => budget.category.toLowerCase() === normalizedCategory
      );

      if (budget) {
        console.log(`Budget trouvé pour la catégorie ${category}:`, budget);
        console.log(`Transactions associées:`, budget.transactions);

        // S'assurer que transactions contient des données valides
        if (
          Array.isArray(budget.transactions) &&
          budget.transactions.length > 0
        ) {
          setBudgetTransactions(budget.transactions);
        } else {
          console.log(
            `Aucune transaction trouvée pour le budget ${budget.category}`
          );
        }
      } else {
        console.log("Aucun budget trouvé pour la catégorie :", category);
      }
    }
  }, [category, budgets]);

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* header */}
      <div className="mx-auto w-[1060px] h-14 py-2 flex justify-between items-center gap-6">
        <h1 className="text-preset-1 font-bold mb-4 capitalize">
          {category} Transactions
        </h1>
        <button
          type="button"
          onClick={() => window.history.back()}
          className=""
        >
          Go Back
        </button>
      </div>
      <div className="mx-auto w-[1060px] flex gap-6 bg-white px-5 pb-3 rounded-2xl">
        <TransactionsList transactions={budgetTransactions} />
      </div>
    </div>
  );
}

export default function Page({ params }: Props) {
  return (
    <BudgetProvider>
      <BudgetTransactionsPage params={params} />
    </BudgetProvider>
  );
}
