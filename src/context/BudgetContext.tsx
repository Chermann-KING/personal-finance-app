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
 * @property {function} addBudget - Fonction pour ajouter un nouveau budget.
 * @property {function} editBudget - Fonction pour modifier un budget existant.
 * @property {function} deleteBudget - Fonction pour supprimer un budget par sa catégorie.
 * @property {function} fetchBudgets - Fonction pour récupérer les budgets depuis MongoDB.
 */
interface BudgetContextProps {
  budgets: Budget[];
  transactions: Transaction[];
  fetchBudgets: () => Promise<void>;
  addBudget: (newBudget: Budget) => void;
  editBudget: (updatedBudget: Budget) => void;
  deleteBudget: (category: string) => void;
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

  /**
   * Fonction pour récupérer les budgets depuis MongoDB.
   */
  const fetchBudgets = useCallback(async () => {
    try {
      const response = await axios.get("/api/budgets");

      const { budgets: fetchedBudgets } = response.data;

      console.log(
        "Budgets récupérés avec transactions incluses :",
        fetchedBudgets
      );

      // Mettre à jour uniquement les budgets
      setBudgets(fetchedBudgets);
    } catch (error) {
      console.error("Erreur lors de la récupération des budgets :", error);
    }
  }, []);

  /**
   * Fonction pour ajouter un nouveau budget.
   *
   * @param {Budget} newBudget - Le budget à ajouter.
   */
  const addBudget = async (newBudget: Budget) => {
    try {
      const response = await axios.post("/api/budgets", newBudget);

      const createdBudget = response.data.budget;
      setBudgets((prevBudgets) => [...prevBudgets, createdBudget]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget :", error);
    }
  };

  /**
   * Fonction pour modifier un budget existant.
   *
   * @param {Budget} updatedBudget - Le budget avec les nouvelles données à mettre à jour.
   */
  const editBudget = async (updatedBudget: Budget) => {
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
    }
  };

  /**
   * Fonction pour supprimer un budget par sa catégorie.
   *
   * @param {string} category - La catégorie du budget à supprimer.
   */
  const deleteBudget = async (category: string) => {
    try {
      await axios.delete(`/api/budgets/${category}`);

      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.category !== category)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du budget :", error);
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        transactions,
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
