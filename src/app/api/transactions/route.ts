import { NextResponse } from "next/server";
import financialData from "@/data/financialData.json";
import { Transaction } from "@/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "Latest";
  const category = searchParams.get("category") || "All Transactions";

  const limit = 10;
  const skip = (Number(page) - 1) * limit;

  // Typage et cast des données JSON
  let transactions: Transaction[] = financialData.transactions;

  // Filtrage des catégories
  if (category !== "All Transactions") {
    transactions = transactions.filter(
      (transaction) => transaction.category === category
    );
  }

  // Recherche par nom
  if (search) {
    transactions = transactions.filter((transaction) =>
      transaction.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Trier
  transactions = transactions.sort((a, b) => {
    switch (sort) {
      case "Latest":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "Oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "A to Z":
        return a.name.localeCompare(b.name);
      case "Z to A":
        return b.name.localeCompare(a.name);
      case "Highest":
        return b.amount - a.amount;
      case "Lowest":
        return a.amount - b.amount;
      default:
        return 0;
    }
  });

  // Pagination des résultats
  const paginatedTransactions = transactions.slice(skip, skip + limit);

  // Renvoi des données
  return NextResponse.json({ transactions: paginatedTransactions });
}
