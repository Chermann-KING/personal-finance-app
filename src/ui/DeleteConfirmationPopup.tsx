import React from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "./Button";

/**
 * Props pour le composant DeleteConfirmation.
 * @property {boolean} isOpen - Indique si la fenêtre modale de confirmation est ouverte.
 * @property {function} onClose - Fonction de rappel pour fermer la fenêtre modale.
 * @property {"budget" | "pot"} itemType - Type d'élément à supprimer (budget ou pot).
 * @property {string} itemName - Le nom de l'élément à supprimer.
 * @property {function} onConfirm - Fonction de rappel pour confirmer la suppression.
 */
interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: "budget" | "pot";
  itemName: string;
  onConfirm: () => void;
}

/**
 * Composant DeleteConfirmation pour afficher une fenêtre modale de confirmation avant la suppression d'un élément.
 *
 * Ce composant affiche une fenêtre modale qui demande à l'utilisateur de confirmer ou d'annuler la suppression
 * d'un élément (budget ou pot). Si l'utilisateur confirme, la fonction `onConfirm` est appelée.
 *
 * @param {DeleteConfirmationProps} props - Les props nécessaires pour configurer le DeleteConfirmation.
 * @returns JSX.Element | null - Le JSX à afficher ou `null` si la fenêtre modale n'est pas ouverte.
 */
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
      {/* Container */}
      <div className="bg-white rounded-lg p-8 w-[560px] flex flex-col gap-y-5">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {`Delete '${itemName}'?`}
          </h2>
          <CloseModalIcon
            className="cursor-pointer text-grey-500"
            onClick={onClose}
          />
        </div>
        {/* Description */}
        <p className="text-grey-500">
          Are you sure you want to delete this {itemType}? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>
        {/* Bouton de confirmation */}
        <Button type="button" onClick={onConfirm} variant={"destroy"}>
          Yes, Confirm Deletion
        </Button>
        {/* Bouton d'annulation */}
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
