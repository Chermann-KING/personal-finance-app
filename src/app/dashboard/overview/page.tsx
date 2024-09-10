"use client";

import { useState, useEffect } from "react";
import BalanceHeader from "@/components/Dashboard/Overview/BalanceHeader";
import TransactionsOverview from "@/components/Dashboard/Overview/TransactionsOverview";
import BudgetOverview from "@/components/Dashboard/Overview/BudgetOverview";
import PotsOverview from "@/components/Dashboard/Overview/PotsOverview";
import ReccuringBillsOverview from "@/components/Dashboard/Overview/ReccuringBillsOverview";

// Simule l'API fetch pour obtenir les données du fichier JSON
const fetchFinancialData = async () => {
  const res = await fetch("/api/financialData");
  if (!res.ok) {
    throw new Error("Failed to fetch financial data");
  }
  return await res.json();
};

export default function OverviewPage() {
  const [data, setData] = useState<any>(null);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-y-[30px] mx-auto p-6">
      {/* Balance Header */}
      <BalanceHeader
        currentBalance={data.balance.current}
        income={data.balance.income}
        expenses={data.balance.expenses}
      />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"> */}
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
            budgets={data.budgets.map((budget: any) => ({
              category: budget.category,
              maximum: budget.maximum,
              spent: data.transactions
                .filter(
                  (transaction: any) => transaction.category === budget.category
                )
                .reduce(
                  (acc: number, curr: any) =>
                    acc + (curr.amount < 0 ? -curr.amount : 0),
                  0
                ),
              theme: budget.theme,
            }))}
          />
          {/* Reccuring Bills */}
          <ReccuringBillsOverview
            paid={data?.bills?.paid || 0}
            upcoming={data?.bills?.upcoming || 0}
            dueSoon={data?.bills?.dueSoon || 0}
          />
        </div>
      </div>
    </div>
  );
}
