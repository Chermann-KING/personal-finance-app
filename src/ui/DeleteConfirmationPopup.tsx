import React, { useEffect, useRef } from "react";
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
 * d'un élément (budget ou pot). Si l'utilisateur confirme, la fonction `onConfirm` est appelée. Si l'utilisateur
 * annule ou ferme la popup, la fonction `onClose` est appelée.
 *
 * Il gère également l'accessibilité en capturant le focus à l'ouverture, en permettant une navigation au clavier
 * entre les éléments de la popup, et en bouclant correctement le focus entre le bouton de fermeture et les éléments de la popup.
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
  const closeModalButtonRef = useRef<HTMLButtonElement | null>(null); // Référence pour le bouton de fermeture
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null); // Référence pour le bouton de confirmation
  const modalRef = useRef<HTMLDivElement | null>(null); // Référence pour la popup elle-même

  /**
   * Capture du focus à l'ouverture de la popup.
   * Quand la popup est ouverte, on donne immédiatement le focus au bouton de confirmation.
   */
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Gestion du cycle de focus (Tab et Shift+Tab).
   * Permet de boucler le focus dans la popup en empêchant de sortir des éléments interactifs.
   * Si "Tab" est utilisé sur le dernier élément, il retourne au premier, et inversement avec "Shift+Tab".
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (focusableElements) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          // Si Shift+Tab est appuyé et qu'on est sur le premier élément, boucler vers le dernier
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          // Si Tab est appuyé et qu'on est sur le dernier élément, boucler vers le premier
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // Si la fenêtre modale n'est pas ouverte, ne pas afficher le composant
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50"
      ref={modalRef}
      onKeyDown={handleKeyDown}
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      {/* Container de la modale */}
      <div className="bg-white rounded-lg p-8 w-[560px] flex flex-col gap-y-5">
        {/* Header avec le titre et le bouton de fermeture */}
        <div className="flex justify-between items-center">
          <h2
            id="delete-dialog-title"
            className="text-preset-1 text-grey-900 font-bold"
          >
            {`Delete '${itemName}'?`}
          </h2>
          <button
            ref={closeModalButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close delete confirmation"
            className="rounded-full"
          >
            <CloseModalIcon
              className="text-grey-500 cursor-pointer"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Description qui explique l'action de suppression */}
        <p id="delete-dialog-description" className="text-grey-500">
          Are you sure you want to delete this {itemType}? This action cannot be
          reversed, and all the data inside it will be removed forever.
        </p>

        {/* Bouton de confirmation de la suppression */}
        <Button
          ref={confirmButtonRef}
          type="button"
          onClick={onConfirm}
          variant={"destroy"}
        >
          Yes, Confirm Deletion
        </Button>

        {/* Bouton d'annulation */}
        <button
          type="button"
          onClick={onClose}
          className="self-center w-auto text-grey-500 text-preset-4 rounded-lg px-3 focus:outline-none focus:font-bold"
        >
          No, Go Back
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
