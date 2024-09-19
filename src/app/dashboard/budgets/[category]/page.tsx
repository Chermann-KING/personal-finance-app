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
  const { transactions } = useBudget();
  const [budgetTransactions, setBudgetTransactions] = useState<Transaction[]>(
    []
  );

  // useEffect(() => {
  //   if (category && transactions) {
  //     console.log("Category:", category);
  //     console.log("Transactions:", transactions);
  //     const filteredTransactions = transactions.filter(
  //       (transaction) =>
  //         transaction.category.trim().toLowerCase() ===
  //         category.trim().toLowerCase()
  //     );
  //     setBudgetTransactions(filteredTransactions);
  //   }
  // }, [category, transactions]);

  useEffect(() => {
    if (category && transactions) {
      console.log("Category:", category);
      console.log("Transactions:", transactions);
      const normalizedCategory = category.replace(/-/g, " ").toLowerCase();
      const filteredTransactions = transactions.filter(
        (transaction) =>
          transaction.category.toLowerCase() === normalizedCategory
      );

      // Logs pour diagnostiquer le problème
      console.log("Category from URL:", category);
      console.log("Normalized category:", normalizedCategory);
      console.log("Filtered Transactions:", filteredTransactions);

      setBudgetTransactions(filteredTransactions);
    }
  }, [category, transactions]);

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
