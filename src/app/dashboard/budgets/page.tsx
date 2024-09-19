"use client";

import Budgets from "@/components/Dashboard/Budgets/Budgets";
import BudgetCards from "@/components/Dashboard/Budgets/BudgetCards";
import Button from "@/ui/Button";
import BudgetPopup from "@/ui/AddOrEditeBudgetPopup";
import { useState } from "react";
import { BudgetProvider } from "@/context/BudgetContext";
import { Budget } from "@/types";

export default function BudgetsPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddBudgetClick = () => {
    setIsPopupOpen(true);
  };

  const handleBudgetSubmit = (budget: Budget) => {
    console.log("Budget soumis :", budget);
    // TODO: Ajouter ou modifier le budget dans le contexte
  };

  return (
    <BudgetProvider>
      {" "}
      {/* Utilisation du contexte ici */}
      <div className="px-10 py-9 flex-col justify-start items-center gap-8 border-[5px] border-red">
        {/* header */}
        <div className="mb-10 mx-auto w-[1060px] h-14 py-2 flex justify-between items-center gap-6">
          <h1 className="text-grey-900 text-preset-1">Budgets</h1>
          <Button
            type="button"
            variant={"primary"}
            onClick={handleAddBudgetClick}
          >
            + Add New Budget
          </Button>
        </div>

        <div className="mx-auto w-[1060px] flex gap-6">
          {/* BudgetPopup */}
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
    </BudgetProvider>
  );
}
