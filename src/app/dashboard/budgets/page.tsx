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

      {/* popup */}
      <BudgetPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
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
