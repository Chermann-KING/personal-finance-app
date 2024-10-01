"use client";

import Budgets from "@/components/Dashboard/Budgets/Budgets";
import BudgetCards from "@/components/Dashboard/Budgets/BudgetCards";
import BudgetPopup from "@/ui/AddOrEditeBudgetPopup";
import { useState } from "react";
import { BudgetProvider } from "@/context/BudgetContext";
import { Budget } from "@/types";
import HeaderPage from "@/components/Dashboard/HeaderPage";

function BudgetsPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddBudgetClick = () => {
    setIsPopupOpen(true);
  };

  const handleBudgetSubmit = (budget: Budget) => {
    console.log("Budget soumis :", budget);
    // TODO: Ajouter ou modifier le budget dans le contexte
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

      <div className="flex gap-6">
        {/* popup */}
        <BudgetPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={handleBudgetSubmit}
        />
        {/* doughnut & spending summary */}
        <Budgets />
        {/* categories budget */}
        <BudgetCards />
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
