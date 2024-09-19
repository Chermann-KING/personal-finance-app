import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Transaction, FetchOptions } from "@/types";
import financialData from "@/data/financialData.json";

interface TransactionContextProps {
  transactions: Transaction[];
  fetchTransactions: (
    options: FetchOptions
  ) => Promise<{ transactions: Transaction[]; total: number }>;
}

const TransactionContext = createContext<TransactionContextProps | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(
    async ({ page, searchQuery, sortBy, categoryFilter }: FetchOptions) => {
      // Simuler l'appel à l'API avec des données locales
      const allTransactions = financialData.transactions as Transaction[];

      // Appliquer les filtres
      let filteredTransactions = allTransactions;

      if (categoryFilter !== "All Transactions") {
        filteredTransactions = filteredTransactions.filter(
          (transaction) => transaction.category === categoryFilter
        );
      }

      if (searchQuery) {
        filteredTransactions = filteredTransactions.filter((transaction) =>
          transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Trier les transactions
      filteredTransactions.sort((a, b) => {
        switch (sortBy) {
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
            return 0; // Par défaut, pas de tri
        }
      });

      console.log("Transactions après tri:", filteredTransactions);

      // Pagination
      const transactionsPerPage = 10;
      const startIndex = (page - 1) * transactionsPerPage;
      const paginatedTransactions = filteredTransactions.slice(
        startIndex,
        startIndex + transactionsPerPage
      );

      setTransactions(paginatedTransactions);
      console.log("Transactions mises à jour:", paginatedTransactions);

      return {
        transactions: paginatedTransactions,
        total: filteredTransactions.length,
      };
    },
    [] // Tableau de dépendances vide pour que la fonction soit stable et ne change pas entre les rendus
  );

  return (
    <TransactionContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
}
