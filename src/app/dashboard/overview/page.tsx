"use client";

import { useEffect, useState } from "react";

export default function OverviewPage() {
  const [data, setData] = useState<{
    balance: { current: number; income: number; expenses: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/financialData");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <h1>Overview</h1>
      <p>Current Balance: {data.balance.current}</p>{" "}
      {/* Affiche le JSON récupéré */}
      <p>Income: {data.balance.income}</p>
      <p>Expenses: {data.balance.expenses}</p>
    </div>
  );
}
