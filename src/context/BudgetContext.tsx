import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { Budget, Transaction } from "@/types";
import axios from "axios";

/**
 * Interface pour les valeurs fournies par le contexte des budgets.
 * @property {Budget[]} budgets - Liste des budgets.
 * @property {Transaction[]} transactions - Liste des transactions associées aux budgets.
 * @property {boolean} isLoading - Indicateur de chargement.
 * @property {string | null} error - Message d'erreur éventuel.
 * @property {function} fetchBudgets - Fonction pour récupérer les budgets depuis MongoDB.
 * @property {function} addBudget - Fonction pour ajouter un nouveau budget.
 * @property {function} editBudget - Fonction pour modifier un budget existant.
 * @property {function} deleteBudget - Fonction pour supprimer un budget par sa catégorie.
 */
interface BudgetContextProps {
  budgets: Budget[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchBudgets: () => Promise<void>;
  addBudget: (newBudget: Budget) => Promise<void>;
  editBudget: (updatedBudget: Budget) => Promise<void>;
  deleteBudget: (category: string) => Promise<void>;
}

// Création du contexte des budgets avec une valeur par défaut undefined
export const BudgetContext = createContext<BudgetContextProps | undefined>(
  undefined
);

/**
 * Hook personnalisé pour accéder au contexte des budgets.
 *
 * Ce hook permet à n'importe quel composant d'accéder aux données et aux fonctions du contexte des budgets.
 * Si ce hook est utilisé en dehors d'un `BudgetProvider`, une erreur est levée.
 *
 * @throws {Error} - Si utilisé en dehors d'un `BudgetProvider`.
 * @returns {BudgetContextProps} - Le contexte des budgets actuel.
 */
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used in a BudgetProvider");
  }
  return context;
};

/**
 * Composant BudgetProvider pour fournir le contexte des budgets à l'application.
 *
 * Ce composant gère l'état des budgets et permet d'ajouter, modifier, ou supprimer des budgets.
 * Il expose ces données et fonctions à tous les composants enfants via le contexte `BudgetContext`.
 *
 * @param {ReactNode} children - Les composants enfants qui peuvent accéder au contexte des budgets.
 * @returns {JSX.Element} - Le provider de contexte des budgets avec ses valeurs et méthodes.
 */
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fonction pour récupérer les budgets depuis MongoDB.
   */
  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/budgets");
      const { budgets: fetchedBudgets } = response.data;
      setBudgets(fetchedBudgets);
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets :", error);
      setError(
        "Impossible de récupérer les budgets. Veuillez réessayer plus tard."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fonction pour ajouter un nouveau budget.
   *
   * @param {Budget} newBudget - Le budget à ajouter.
   */
  const addBudget = async (newBudget: Budget) => {
    setError(null);
    try {
      const response = await axios.post("/api/budgets", newBudget);
      const createdBudget = response.data.budget;
      setBudgets((prevBudgets) => [...prevBudgets, createdBudget]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget :", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError("Un budget avec cette catégorie existe déjà.");
      } else {
        setError(
          "Impossible d'ajouter le budget. Veuillez réessayer plus tard."
        );
      }
      throw error;
    }
  };

  /**
   * Fonction pour modifier un budget existant.
   *
   * @param {Budget} updatedBudget - Le budget avec les nouvelles données à mettre à jour.
   */
  const editBudget = async (updatedBudget: Budget) => {
    setError(null);
    try {
      const response = await axios.put(
        `/api/budgets/${updatedBudget.category}`,
        updatedBudget
      );
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) =>
          budget.category === updatedBudget.category
            ? response.data.budget
            : budget
        )
      );
    } catch (error) {
      console.error("Erreur lors de la modification du budget :", error);
      setError(
        "Impossible de modifier le budget. Veuillez réessayer plus tard."
      );
      throw error;
    }
  };

  /**
   * Fonction pour supprimer un budget par sa catégorie.
   *
   * @param {string} category - La catégorie du budget à supprimer.
   */
  const deleteBudget = async (category: string) => {
    setError(null);
    try {
      await axios.delete(`/api/budgets/${category}`);
      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.category !== category)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du budget :", error);
      setError(
        "Impossible de supprimer le budget. Veuillez réessayer plus tard."
      );
      throw error;
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        transactions,
        isLoading,
        error,
        fetchBudgets,
        addBudget,
        editBudget,
        deleteBudget,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
