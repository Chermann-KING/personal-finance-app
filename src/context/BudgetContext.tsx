import React, { createContext, useContext, useState, ReactNode } from "react";
import { Budget, Transaction } from "@/types";
import financialData from "@/data/financialData.json";

// Interface du contexte
interface BudgetContextProps {
  budgets: Budget[];
  transactions: Transaction[];
  addBudget: (newBudget: Budget) => void;
  editBudget: (updatedBudget: Budget) => void;
  deleteBudget: (category: string) => void;
}

// Créer le contexte
const BudgetContext = createContext<BudgetContextProps | undefined>(undefined);

// Hook pour utiliser le contexte facilement
export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget doit être utilisé dans un BudgetProvider");
  }
  return context;
};

// Provider du contexte
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [budgets, setBudgets] = useState<Budget[]>(financialData.budgets);
  const [transactions] = useState<Transaction[]>(financialData.transactions);

  const addBudget = (newBudget: Budget) => {
    setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
  };

  const editBudget = (updatedBudget: Budget) => {
    setBudgets((prevBudgets) =>
      prevBudgets.map((budget) =>
        budget.category === updatedBudget.category ? updatedBudget : budget
      )
    );
  };

  const deleteBudget = (category: string) => {
    setBudgets((prevBudgets) =>
      prevBudgets.filter((budget) => budget.category !== category)
    );
  };

  return (
    <BudgetContext.Provider
      value={{ budgets, transactions, addBudget, editBudget, deleteBudget }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
