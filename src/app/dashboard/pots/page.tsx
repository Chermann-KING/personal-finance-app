"use client";

import React, { useState } from "react";
import { usePot, PotProvider } from "@/context/PotContext";
import { Pot } from "@/types";

import PotPopup from "@/ui/AddOrEditPotPopup";
import PotList from "@/components/Dashboard/Pots/PotList";
import PotTransactionModal from "@/ui/PotTransactionModal";
import HeaderPage from "@/components/Dashboard/HeaderPage";

function PotsPage() {
  const { addPot, editPot, addMoneyToPot, withdrawFromPot } = usePot();
  const [isModalOpen, setModalOpen] = useState(false);
  const [potToEdit, setPotToEdit] = useState<Pot | null>(null);
  const [potToTransact, setPotToTransact] = useState<Pot | null>(null);
  const [transactionType, setTransactionType] = useState<"add" | "withdraw">();

  const handleAddNewPot = () => {
    setPotToEdit(null);
    setModalOpen(true);
  };

  const handleSubmit = (pot: Omit<Pot, "total">) => {
    const potWithTotal: Pot = {
      ...pot,
      total: potToEdit ? potToEdit.total || 0 : 0,
    };
    if (potToEdit) {
      editPot(potWithTotal);
      console.log("Pot modifié :", potWithTotal);
    } else {
      addPot(potWithTotal);
      console.log("Pot ajouté :", potWithTotal);
    }
  };

  // Ouvre la modal pour ajouter ou retirer de l'argent
  const openTransactionModal = (pot: Pot, type: "add" | "withdraw") => {
    setPotToTransact(pot);
    setTransactionType(type);
  };

  // Gère la soumission de la transaction
  const handleTransaction = (amount: number) => {
    if (transactionType === "add") {
      addMoneyToPot(potToTransact!.name, amount);
    } else {
      withdrawFromPot(potToTransact!.name, amount);
    }
    setPotToTransact(null); // Ferme la modal après transaction
  };

  const handleEditPot = (pot: Pot) => {
    setPotToEdit(pot);
    setModalOpen(true);
  };

  const handleDeletePot = (pot: Pot) => {
    if (window.confirm(`Are you sure you want to delete ${pot.name}?`)) {
      // Implement delete logic here
    }
  };

  return (
    <div className="self-stretch flex flex-col gap-y-8">
      {/* header */}
      <HeaderPage
        title="Pots"
        showButton
        buttonText="+ Add New Pot"
        onButtonClick={handleAddNewPot}
      />

      <div className="flex gap-6">
        {/* popup */}
        {isModalOpen && (
          <PotPopup
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            potToEdit={potToEdit}
            onSubmit={handleSubmit}
          />
        )}

        {/* Pot Transaction Modal */}
        {potToTransact && (
          <PotTransactionModal
            isOpen={!!potToTransact}
            onClose={() => setPotToTransact(null)}
            pot={potToTransact}
            actionType={transactionType!}
            onSubmit={handleTransaction}
          />
        )}

        {/* Pots */}
        <PotList
          onEditPot={handleEditPot}
          onDeletePot={handleDeletePot}
          onAddMoney={(pot) => openTransactionModal(pot, "add")}
          onWithdraw={(pot) => openTransactionModal(pot, "withdraw")}
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <PotProvider>
      <PotsPage />
    </PotProvider>
  );
}
