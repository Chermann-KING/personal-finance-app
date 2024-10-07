import React from "react";
import BudgetCard from "@/components/Dashboard/Budgets/BudgetCard";
import { useBudget } from "@/context/BudgetContext";
import { CategoryDropdownOptions } from "@/ui/CategoriesDropdown";

export default function BudgetCards() {
  const { budgets } = useBudget();

  return (
    <div className="self-stretch flex flex-col items-center gap-y-6">
      {budgets.map((budget) => {
        if (!budget.category) {
          console.error("Budget sans catégorie:", budget);
          return null; // Ignorer les budgets sans catégorie
        }

        const { transactions: categoryTransactions = [] } = budget;

        const mapCategoryToDropdownOption = (
          category: string
        ): CategoryDropdownOptions => {
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
          return validCategories.includes(category as CategoryDropdownOptions)
            ? (category as CategoryDropdownOptions)
            : "General";
        };

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
