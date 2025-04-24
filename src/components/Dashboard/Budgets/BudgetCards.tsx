import React from "react";
import BudgetCard from "@/components/Dashboard/Budgets/BudgetCard";
import { useBudget } from "@/context/BudgetContext";
import { CategoryDropdownOptions } from "@/ui/CategoriesDropdown";

export default function BudgetCards() {
  const { budgets, isLoading, error } = useBudget();

  if (isLoading) {
    return (
      <div className="self-stretch flex justify-center items-center h-[200px] bg-white rounded-lg">
        <p className="text-preset-4 text-grey-500">Chargement des budgets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="self-stretch flex justify-center items-center h-[200px] bg-white rounded-lg">
        <p className="text-preset-4 text-red-500">{error}</p>
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <div className="self-stretch flex justify-center items-center h-[200px] bg-white rounded-lg">
        <p className="text-preset-4 text-grey-500">Aucun budget disponible</p>
      </div>
    );
  }

  const validCategories: CategoryDropdownOptions[] = [
    "All Transactions",
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Personal Care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General",
  ];

  const mapCategoryToDropdownOption = (
    category: string
  ): CategoryDropdownOptions => {
    return validCategories.includes(category as CategoryDropdownOptions)
      ? (category as CategoryDropdownOptions)
      : "General";
  };

  return (
    <div className="self-stretch flex flex-col items-center gap-y-6">
      {budgets.map((budget) => {
        if (!budget.category) {
          console.error("Budget sans catégorie:", budget);
          return null;
        }

        const categoryTransactions = budget.transactions || [];

        return (
          <BudgetCard
            key={budget.category}
            category={mapCategoryToDropdownOption(budget.category)}
            maximum={budget.maximum}
            spent={budget.spent ?? 0}
            remaining={budget.remaining ?? 0}
            theme={budget.theme}
            latestTransactions={categoryTransactions.slice(0, 3)}
          />
        );
      })}
    </div>
  );
}
