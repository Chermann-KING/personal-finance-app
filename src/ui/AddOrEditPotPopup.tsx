import React, { useState, useEffect, useContext, useRef } from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import InputField from "@/ui/InputField";
import Button from "@/ui/Button";
import ColorsDropdown from "@/ui/ColorsDropdown";
import { PotContext } from "@/context/PotContext";

/**
 * Props pour le composant PotPopup.
 * @property {boolean} isOpen - Indique si la fenêtre modale est ouverte.
 * @property {function} onClose - Fonction de rappel pour fermer la fenêtre modale.
 * @property {{ name: string; target: number; theme: string } | null} [potToEdit] - Le pot à éditer (s'il y a lieu), ou `null` pour créer un nouveau pot.
 * @property {function} onSubmit - Fonction de rappel pour soumettre les informations du pot (nom, objectif et thème).
 */
interface PotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  potToEdit?: {
    name: string;
    target: number;
    theme: string;
  } | null; // Pot à éditer ou null pour un nouveau pot
  onSubmit: (pot: { name: string; target: number; theme: string }) => void;
}

/**
 * Composant PotPopup pour ajouter ou éditer un pot d'épargne.
 *
 * Ce composant affiche une fenêtre modale qui permet à l'utilisateur de créer un nouveau pot ou de modifier un pot existant.
 * L'utilisateur peut définir le nom du pot, l'objectif d'épargne et choisir un thème de couleur.
 *
 * Les informations du pot sont ensuite soumises via la fonction `onSubmit`.
 *
 * @param {PotPopupProps} props - Les props nécessaires pour configurer le PotPopup.
 * @returns JSX.Element | null - Le JSX à afficher ou `null` si la fenêtre modale n'est pas ouverte.
 */
const PotPopup: React.FC<PotPopupProps> = ({
  isOpen,
  onClose,
  potToEdit,
  onSubmit,
}) => {
  const potContext = useContext(PotContext); // Récupération des pots existants via le contexte
  const pots = potContext ? potContext.pots : [];

  const [name, setName] = useState<string>(""); // État pour le nom du pot
  const [target, setTarget] = useState<number | "">(0); // État pour l'objectif d'épargne
  const [theme, setTheme] = useState<string>("#277C78"); // État pour le thème de couleur

  const popupRef = useRef<HTMLDivElement>(null);
  const firstFocusableElementRef = useRef<HTMLButtonElement | null>(null);
  const closeModalButtonRef = useRef<HTMLButtonElement | null>(null);

  /**
   * Effet mettant à jour les champs du formulaire si un pot est en cours d'édition
   */
  useEffect(() => {
    if (potToEdit) {
      setName(potToEdit.name);
      setTarget(potToEdit.target);
      setTheme(potToEdit.theme);
    } else {
      setName("");
      setTarget("");
      setTheme("#277C78"); // Valeur par défaut
    }
  }, [potToEdit]);

  /**
   * Effet Capturant le focus dans la popup quand elle est ouverte
   */
  useEffect(() => {
    if (isOpen && popupRef.current && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Fonction permettant de gérer le cycle du focus dans la popup
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      const focusableElements = popupRef.current?.querySelectorAll(
        "button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (focusableElements) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          // Si Shift+Tab est appuyé et que l'on est sur le premier élément, on met le focus sur le dernier
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          // Si Tab est appuyé et que l'on est sur le dernier élément, on met le focus sur le premier
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  /**
   * Fonction permettant la validation et soumission du pot
   */
  const handleSave = () => {
    if (!name || target === "" || !theme) return;
    onSubmit({ name, target: Number(target), theme });
    onClose(); // Fermer la popup après la soumission
  };

  if (!isOpen) return null; // Ne rien afficher si la popup n'est pas ouverte

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50"
      onKeyDown={handleKeyDown}
      ref={popupRef}
    >
      <div className="bg-white flex flex-col gap-y-5 rounded-lg p-8 w-[560px] mx-4">
        {/* En-tête de la popup */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {potToEdit ? "Edit Pot" : "Add New Pot"}
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
          {potToEdit
            ? "Update your saving targets as your goals change."
            : "Set a savings target for this pot."}
        </p>

        {/* Champs de formulaire */}
        <div className="flex flex-col gap-y-4">
          <InputField
            label="Pot Name"
            name="potName"
            type="text"
            placeholder="e.g. Rainy Days"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="Target"
            name="potTarget"
            type="number"
            placeholder="e.g. 2000"
            prefix="$"
            value={target.toString()}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
          {/* Sélection du thème */}
          <div className="flex flex-col gap-y-1">
            <span className="text-preset-5 text-grey-500 font-bold">
              Budget Theme
            </span>
            <ColorsDropdown
              selectedColor={theme}
              onSelectColor={setTheme}
              existingColors={pots} // Passe les pots existants pour éviter les doublons de couleur
            />
          </div>
        </div>

        {/* Bouton d'action */}
        <Button
          ref={firstFocusableElementRef}
          onClick={handleSave}
          className="w-full"
          variant="primary"
        >
          {potToEdit ? "Save Changes" : "Add Pot"}
        </Button>
      </div>
    </div>
  );
};

export default PotPopup;
