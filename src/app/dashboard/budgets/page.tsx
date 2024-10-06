"use client";

import { useEffect, useState } from "react";
import { BudgetProvider, useBudget } from "@/context/BudgetContext";
import { Budget } from "@/types";
import HeaderPage from "@/components/Dashboard/HeaderPage";
import Budgets from "@/components/Dashboard/Budgets/Budgets";
import BudgetCards from "@/components/Dashboard/Budgets/BudgetCards";
import BudgetPopup from "@/ui/AddOrEditeBudgetPopup";

function BudgetsPage() {
  const { fetchBudgets } = useBudget();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);

  const handleAddBudgetClick = () => {
    setBudgetToEdit(null);
    setIsPopupOpen(true);
  };

  const { addBudget, editBudget } = useBudget();

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleBudgetSubmit = (budget: Budget) => {
    console.log("Budget soumis :", budget);

    if (budgetToEdit) {
      // Si un budget est en cours d'édition, on appelle editBudget
      editBudget(budget);
    } else {
      // Sinon, on crée un nouveau budget
      addBudget(budget);
    }

    setIsPopupOpen(false); // Ferme la popup après soumission
  };

  return (
    <div className="self-stretch flex flex-col gap-y-8">
      {/* header */}
      <HeaderPage
        title="Budgets"
        showButton
        buttonText="+ Add New Budget"
        onButtonClick={handleAddBudgetClick}
      />

      {/* popup */}
      <BudgetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        budgetToEdit={budgetToEdit || undefined}
        onSubmit={handleBudgetSubmit}
      />
      <div className="flex flex-col md:flex-row gap-6 sm:pb-[74px] lg:pb-0">
        {/* doughnut & spending summary */}
        <div className="max-sm:w-full max-md:w-[608px] w-[428px]">
          <Budgets />
        </div>

        {/* categories budget */}
        <div className="max-sm:w-full max-md:w-[608px] w-[608px]">
          <BudgetCards />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <BudgetProvider>
      <BudgetsPage />
    </BudgetProvider>
  );
}
