import React from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "./Button"; // Si tu as déjà un composant Button réutilisable
import { useBudget } from "@/context/BudgetContext"; // Import du contexte

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  budgetCategory: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  budgetCategory,
}) => {
  const { deleteBudget } = useBudget(); // Utilisation du contexte BudgetContext

  const handleDelete = () => {
    deleteBudget(budgetCategory);
    onClose(); // Ferme la popup après suppression
  };

  if (!isOpen) return null; // Ne rien afficher si la popup n'est pas ouverte

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50">
      {/* container */}
      <div className="bg-white rounded-lg p-8 w-[560px] flex flex-col gap-y-5">
        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {`Delete '${budgetCategory}'?`}
          </h2>
          <CloseModalIcon
            className="cursor-pointer text-grey-500"
            onClick={onClose}
          />
        </div>
        {/* description */}
        <p className="text-grey-500">
          Are you sure you want to delete this budget? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>
        <Button type="button" onClick={handleDelete} variant={"destroy"}>
          Yes, Confirm Deletion
        </Button>
        <button
          type="button"
          onClick={onClose}
          className="text-grey-500 text-preset-4"
        >
          No, Go Back
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
