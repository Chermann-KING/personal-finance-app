import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Transaction, FetchOptions } from "@/types";

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
      try {
        const url = new URL("/api/transactions", window.location.origin);
        url.searchParams.set("page", String(page));
        if (searchQuery) {
          url.searchParams.set("search", searchQuery);
        }
        if (sortBy) {
          url.searchParams.set("sort", sortBy);
        }
        if (categoryFilter) {
          url.searchParams.set("category", categoryFilter);
        }

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        // Récupération des transactions et du total depuis l'API
        const { transactions: fetchedTransactions, total } =
          await response.json();

        // Met à jour les transactions dans le state
        setTransactions(fetchedTransactions);

        // Renvoie les transactions et le total
        return { transactions: fetchedTransactions, total };
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions:",
          error
        );
        throw error;
      }
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
