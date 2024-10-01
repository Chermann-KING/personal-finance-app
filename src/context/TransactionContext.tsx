import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Transaction, FetchOptions } from "@/types";
import financialData from "@/data/financialData.json";

/**
 * Interface pour les valeurs fournies par le contexte des transactions.
 * @property {Transaction[]} transactions - Liste des transactions filtrées et paginées.
 * @property {function} fetchTransactions - Fonction pour récupérer et filtrer les transactions selon les options de recherche et de tri.
 */
interface TransactionContextProps {
  transactions: Transaction[];
  fetchTransactions: (
    options: FetchOptions
  ) => Promise<{ transactions: Transaction[]; total: number }>;
}

// Création du contexte des transactions avec une valeur par défaut null
const TransactionContext = createContext<TransactionContextProps | null>(null);

/**
 * Composant TransactionProvider pour fournir le contexte des transactions à l'application.
 *
 * Ce composant gère l'état des transactions et permet de les filtrer, trier et paginer selon les options fournies.
 * Il expose ces données et fonctions à tous les composants enfants via le contexte `TransactionContext`.
 *
 * @param {ReactNode} children - Les composants enfants qui peuvent accéder au contexte des transactions.
 * @returns {JSX.Element} - Le provider de contexte des transactions avec ses valeurs et méthodes.
 */
export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // État pour stocker les transactions

  /**
   * Fonction pour récupérer et filtrer les transactions selon les options de recherche, tri et pagination.
   *
   * @param {FetchOptions} options - Les options pour filtrer, trier et paginer les transactions.
   * @returns {Promise<{transactions: Transaction[], total: number}>} - Retourne les transactions filtrées et paginées ainsi que le nombre total de résultats.
   */
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
            return 0; // Pas de tri par défaut
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
    [] // Tableau de dépendances vide pour que la fonction soit stable
  );

  return (
    <TransactionContext.Provider value={{ transactions, fetchTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder au contexte des transactions.
 *
 * Ce hook permet à n'importe quel composant d'accéder aux données et aux fonctions du contexte des transactions.
 * Si ce hook est utilisé en dehors d'un `TransactionProvider`, une erreur est levée.
 *
 * @throws {Error} - Si utilisé en dehors d'un `TransactionProvider`.
 * @returns {TransactionContextProps} - Le contexte des transactions actuel.
 */
export function useTransactionContext() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider"
    );
  }
  return context;
}
