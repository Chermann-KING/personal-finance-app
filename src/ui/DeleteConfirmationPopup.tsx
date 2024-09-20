import React from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "./Button";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "budget" | "pot"; // Pour spécifier si on supprime un budget ou un pot
  itemName: string; // Le nom du budget ou du pot
  onConfirm: () => void; // Fonction pour confirmer la suppression
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  onClose,
  itemType,
  itemName,
  onConfirm,
}) => {
  if (!isOpen) return null; // Ne rien afficher si la popup n'est pas ouverte

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50">
      {/* container */}
      <div className="bg-white rounded-lg p-8 w-[560px] flex flex-col gap-y-5">
        {/* header */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {`Delete '${itemName}'?`}
          </h2>
          <CloseModalIcon
            className="cursor-pointer text-grey-500"
            onClick={onClose}
          />
        </div>
        {/* description */}
        <p className="text-grey-500">
          Are you sure you want to delete this {itemType}? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>
        <Button type="button" onClick={onConfirm} variant={"destroy"}>
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
