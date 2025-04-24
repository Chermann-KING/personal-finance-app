"use client";

import { useEffect, useState } from "react";
import { BudgetProvider, useBudget } from "@/context/BudgetContext";
import { Budget } from "@/types";
import HeaderPage from "@/components/Dashboard/HeaderPage";
import Budgets from "@/components/Dashboard/Budgets/Budgets";
import BudgetCards from "@/components/Dashboard/Budgets/BudgetCards";
import BudgetPopup from "@/ui/AddOrEditeBudgetPopup";

function BudgetsPage() {
  const { fetchBudgets, addBudget, editBudget } = useBudget();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddBudgetClick = () => {
    setBudgetToEdit(null);
    setError(null);
    setIsPopupOpen(true);
  };

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleBudgetSubmit = async (budget: Budget) => {
    try {
      setError(null);
      if (budgetToEdit) {
        await editBudget(budget);
      } else {
        await addBudget(budget);
      }
      setIsPopupOpen(false); // Ferme la popup seulement si l'opération a réussi
      await fetchBudgets(); // Rafraîchit la liste des budgets
    } catch (error) {
      // L'erreur est déjà gérée dans le contexte, pas besoin de la réafficher ici
      console.error("Erreur lors de la soumission du budget :", error);
    }
  };

  const handleClosePopup = () => {
    setError(null);
    setIsPopupOpen(false);
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
        onClose={handleClosePopup}
        budgetToEdit={budgetToEdit || undefined}
        onSubmit={handleBudgetSubmit}
        error={error}
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
