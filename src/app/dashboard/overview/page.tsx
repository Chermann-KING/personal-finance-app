"use client";

import { useState, useEffect } from "react";
import TransactionsOverview from "@/components/Dashboard/Overview/TransactionsOverview";
import BudgetOverview from "@/components/Dashboard/Overview/BudgetOverview";
import PotsOverview from "@/components/Dashboard/Overview/PotsOverview";
import ReccuringBillsOverview from "@/components/Dashboard/Overview/ReccuringBillsOverview";
import { FinancialData, Budget, Transaction } from "@/types";
import { CurrentBalance } from "@/components/Dashboard/Overview/CurrentBalance";
import { Income } from "@/components/Dashboard/Overview/Income";
import { Expenses } from "@/components/Dashboard/Overview/Expenses";
import HeaderPage from "@/components/Dashboard/HeaderPage";

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
    <div className="self-stretch flex flex-col gap-y-8">
      {/* Header */}
      <HeaderPage />
      {/* currence balance, icome & expenses */}
      <div className="flex flex-col gap-y-3 sm:gap-x-6 sm:flex-row">
        <CurrentBalance currentBalance={data.balance.current} />
        <Income income={data.balance.income} />
        <Expenses expenses={data.balance.expenses} />
      </div>

      {/* pots, transactions, budgets & recurring bills */}
      <div className=" flex justify-between sm:gap-x-6 gap-y-6 max-md:flex-col">
        {/* Pots & Transactions */}
        <div className="flex flex-col gap-y-4 sm:gap-y-6">
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
