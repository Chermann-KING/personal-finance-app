"use client";
import { useEffect, useState } from "react";
import { BudgetProvider, useBudget } from "@/context/BudgetContext";
import TransactionsList from "@/components/Dashboard/Transactions/TransactionsList";
import { Transaction } from "@/types";

interface Props {
  params: { category: string };
}

function BudgetTransactionsPage({ params }: Props) {
  const { category } = params;
  const { budgets, fetchBudgets } = useBudget();
  const [budgetTransactions, setBudgetTransactions] = useState<Transaction[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (budgets.length === 0) {
      fetchBudgets().catch(() => {
        setError("Erreur lors du chargement des budgets. Veuillez réessayer.");
      });
    }
  }, [budgets, fetchBudgets]);

  useEffect(() => {
    if (category && budgets.length > 0) {
      const normalizedCategory = category.replace(/-/g, " ").toLowerCase();
      const budget = budgets.find(
        (budget) => budget.category.toLowerCase() === normalizedCategory
      );

      if (budget) {
        if (
          Array.isArray(budget.transactions) &&
          budget.transactions.length > 0
        ) {
          setBudgetTransactions(budget.transactions);
        } else {
          setError(
            `Aucune transaction trouvée pour la catégorie ${budget.category}.`
          );
        }
      } else {
        setError(`Aucun budget trouvé pour la catégorie : ${category}.`);
      }
    }
  }, [category, budgets]);

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* Affichage du message d'erreur si présent */}
      {error && (
        <div className="mx-auto w-[1060px] p-4 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      {/* Header */}
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
      {/* Liste des transactions */}
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
