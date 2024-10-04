import React, { useState, useRef, useEffect } from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "@/ui/Button";
import InputField from "@/ui/InputField";
import { Pot } from "@/types";

/**
 * Props pour le composant PotTransactionModal.
 * @property {boolean} isOpen - Indique si la fenêtre modale est ouverte.
 * @property {function} onClose - Fonction de rappel pour fermer la fenêtre modale.
 * @property {Pot} pot - L'objet représentant le pot concerné.
 * @property {function} onSubmit - Fonction de rappel pour soumettre la transaction (ajouter ou retirer de l'argent).
 * @property {"add" | "withdraw"} actionType - Indique si l'utilisateur ajoute ("add") ou retire ("withdraw") des fonds du pot.
 */
interface PotTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  pot: Pot;
  onSubmit: (amount: number) => void;
  actionType: "add" | "withdraw";
}

/**
 * Composant PotTransactionModal pour ajouter ou retirer des fonds d'un pot d'épargne.
 *
 * Ce composant affiche une fenêtre modale où l'utilisateur peut saisir un montant à ajouter ou à retirer d'un pot d'épargne.
 * Il inclut une validation des montants et met à jour l'état du pot, en affichant les changements dans une barre de progression.
 *
 * @param {PotTransactionModalProps} props - Les props nécessaires pour configurer le PotTransactionModal.
 * @returns JSX.Element | null - Le JSX à afficher ou `null` si la fenêtre modale n'est pas ouverte.
 */
const PotTransactionModal: React.FC<PotTransactionModalProps> = ({
  isOpen,
  onClose,
  pot,
  onSubmit,
  actionType,
}) => {
  // State pour le montant entré par l'utilisateur
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  /**
   * Références pour gérer le focus et le cycle du focus dans la modale
   */
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement | null>(null);
  const closeModalButtonRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Capture le focus sur le premier élément focusable lors de l'ouverture de la popup
   */
  useEffect(() => {
    if (isOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null; // Ne rien afficher si la modale est fermée

  /**
   * Conversion de l'entrée utilisateur en nombre
   */
  const amountNumber = amount ? Number(amount) : 0;

  /**
   * Calcul du nouveau total après ajout ou retrait
   */
  const newTotal =
    actionType === "add" ? pot.total + amountNumber : pot.total - amountNumber;

  /**
   * Fonction permettant la validation du montant saisi
   */
  const validateAmount = () => {
    if (amountNumber <= 0) {
      setError("The amount must be greater than zero.");
      return false;
    }
    if (actionType === "withdraw" && amountNumber > pot.total) {
      setError("You cannot withdraw more than the total saved in this pot.");
      return false;
    }
    if (actionType === "withdraw" && newTotal < 0) {
      setError("Withdrawal would result in a negative balance.");
      return false;
    }
    setError(null);
    return true;
  };

  /**
   * Calcul de la largeur de la barre de progression avant et après l'opération
   */
  const currentPercentage = (pot.total / pot.target) * 100;
  const newPercentage = Math.min((newTotal / pot.target) * 100, 100);

  // Gestion de la soumission du formulaire
  const handleSubmit = () => {
    if (validateAmount()) {
      onSubmit(amountNumber);
      onClose();
    }
  };

  /**
   * Gestion du cycle de focus (Tab et Shift+Tab).
   * Permet de boucler le focus dans la popup en empêchant de sortir des éléments interactifs.
   * Si "Tab" est utilisé sur le dernier élément, il retourne au premier, et inversement avec "Shift+Tab".
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        "button, input, [tabindex]:not([tabindex='-1'])"
      );
      if (focusableElements) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          // Si Shift+Tab et on est sur le premier élément, boucler vers le dernier
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          // Si Tab et on est sur le dernier élément, boucler vers le premier
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  return (
    <div
      ref={modalRef}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50"
    >
      <div className="bg-white flex flex-col gap-y-5 rounded-lg p-8 w-[560px]">
        {/* Header de la modale */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {actionType === "add"
              ? `Add to '${pot.name}'`
              : `Withdraw from '${pot.name}'`}
          </h2>
          <button
            ref={closeModalButtonRef}
            type="button"
            onClick={onClose}
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-controls="close-popup"
            className="rounded-full"
          >
            <CloseModalIcon
              className="text-grey-500 cursor-pointer"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Message explicatif */}
        <p className="text-preset-4 text-grey-500">
          {actionType === "add"
            ? "Add funds to this savings pot to reach your goals faster. Every contribution brings you closer to your target."
            : "Withdraw funds from this savings pot. Be sure to keep enough to meet your future goals."}
        </p>

        {/* Barre de progression */}
        <div className="flex flex-col gap-y-4">
          <div className="flex justify-between items-center">
            <p className="text-preset-4 text-grey-500">New Amount</p>
            <p className="text-preset-1 text-grey-900 font-bold">
              {newTotal.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Barre de progression visuelle */}
          <div className="w-full h-2 bg-beige-100 rounded flex">
            <div
              className="self-stretch rounded-l mr-[2px]"
              style={{
                width: `${currentPercentage}%`,
                backgroundColor: "#201F24",
              }}
            />
            {actionType === "add" ? (
              <div
                className="self-stretch rounded-r bg-green"
                style={{
                  width: `${newPercentage - currentPercentage}%`,
                  backgroundColor: "#277C78",
                }}
              />
            ) : (
              <div
                className="self-stretch rounded-r bg-red"
                style={{
                  width: `${currentPercentage - newPercentage}%`,
                  backgroundColor: "#C94736",
                }}
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <p
              className={`text-preset-5 font-bold ${
                actionType === "add" ? "text-green" : "text-red"
              }`}
            >
              {newPercentage.toFixed(2)}%
            </p>
            <p className="text-preset-5 text-grey-500">
              Target of ${pot.target}
            </p>
          </div>
        </div>

        {/* Champ de saisie pour le montant */}
        <InputField
          ref={firstFocusableRef}
          label={actionType === "add" ? "Amount to Add" : "Amount to Withdraw"}
          name="amount"
          type="number"
          placeholder="e.g. 200"
          prefix="$"
          value={amount.toString()}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {/* Affichage des erreurs */}
        {error && <p className="text-preset-4 text-red">{error}</p>}

        {/* Bouton de soumission */}
        <Button onClick={handleSubmit} className="w-full" variant="primary">
          {actionType === "add" ? "Confirm Addition" : "Confirm Withdrawal"}
        </Button>
      </div>
    </div>
  );
};

export default PotTransactionModal;
