"use client";

import { useState, useEffect } from "react";
import BalanceHeader from "@/components/Dashboard/Overview/BalanceHeader";
import TransactionsOverview from "@/components/Dashboard/Overview/TransactionsOverview";
import BudgetOverview from "@/components/Dashboard/Overview/BudgetOverview";
import PotsOverview from "@/components/Dashboard/Overview/PotsOverview";
import ReccuringBillsOverview from "@/components/Dashboard/Overview/ReccuringBillsOverview";
import { FinancialData, Budget, Transaction } from "@/types";

// Simule l'API fetch pour obtenir les données du fichier JSON
const fetchFinancialData = async (): Promise<FinancialData> => {
  const res = await fetch("/api/financialData");
  if (!res.ok) {
    throw new Error("Failed to fetch financial data");
  }
  return await res.json();
};

export default function OverviewPage() {
  const [data, setData] = useState<FinancialData | null>(null); // Typage approprié
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchFinancialData();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-full flex justify-center items-center text-preset-1 text-grey-900 font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full flex justify-center items-center text-preset-1 text-red font-semibold">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-full flex justify-center items-center text-preset-1 text-grey-900 font-semibold">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-[30px] mx-auto p-6">
      {/* Balance Header */}
      <BalanceHeader
        currentBalance={data.balance.current}
        income={data.balance.income}
        expenses={data.balance.expenses}
      />

      <div className="mx-auto w-[1060px] flex justify-between">
        {/* Pots & Transactions */}
        <div className="flex flex-col gap-y-6">
          {/* Pots Overview */}
          <PotsOverview pots={data.pots} />

          {/* Recent Transactions */}
          <TransactionsOverview transactions={data.transactions.slice(0, 5)} />
        </div>

        {/* Budgets & Bills */}
        <div className="flex flex-col gap-y-6">
          {/* Budget Overview */}
          <BudgetOverview
            budgets={data.budgets.map((budget: Budget) => ({
              category: budget.category,
              maximum: budget.maximum,
              spent: data.transactions
                .filter(
                  (transaction: Transaction) =>
                    transaction.category === budget.category
                )
                .reduce(
                  (acc: number, curr: Transaction) =>
                    acc + (curr.amount < 0 ? -curr.amount : 0),
                  0
                ),
              theme: budget.theme,
            }))}
          />

          {/* Reccuring Bills */}
          <ReccuringBillsOverview
            paid={data.bills.paid}
            upcoming={data.bills.upcoming}
            dueSoon={data.bills.dueSoon}
          />
        </div>
      </div>
    </div>
  );
}
