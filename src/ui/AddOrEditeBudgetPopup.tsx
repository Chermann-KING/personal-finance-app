import React, { useState, useContext, useEffect } from "react";
import { BudgetContext } from "@/context/BudgetContext";
import CategoriesDropdown, {
  CategoryDropdownOptions,
} from "@/ui/CategoriesDropdown";
import ColorsDropdown from "@/ui/ColorsDropdown";
import InputField from "@/ui/InputField";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "./Button";

/**
 * Props pour le composant BudgetPopup.
 * @property {boolean} isOpen - Indique si la fenêtre modale est ouverte.
 * @property {function} onClose - Fonction de rappel pour fermer la fenêtre modale.
 * @property {{category: CategoryDropdownOptions; maximum: number; theme: string} | undefined} [budgetToEdit] - Le budget à éditer, ou `undefined` pour créer un nouveau budget.
 * @property {function} onSubmit - Fonction de rappel pour soumettre les informations du budget (catégorie, maximum, thème).
 */
interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: {
    category: CategoryDropdownOptions;
    maximum: number;
    theme: string;
  };
  onSubmit: (budget: {
    category: CategoryDropdownOptions;
    maximum: number;
    theme: string;
  }) => void;
}

/**
 * Composant BudgetPopup pour ajouter ou éditer un budget.
 *
 * Ce composant permet à l'utilisateur de créer un nouveau budget ou de modifier un budget existant.
 * L'utilisateur peut sélectionner une catégorie, définir un montant maximum et choisir un thème pour le budget.
 *
 * Les informations du budget sont ensuite soumises via la fonction `onSubmit`.
 *
 * @param {PopupProps} props - Les props nécessaires pour configurer le BudgetPopup.
 * @returns JSX.Element | null - Le JSX à afficher ou `null` si la fenêtre modale n'est pas ouverte.
 */
const BudgetPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  budgetToEdit,
  onSubmit,
}) => {
  const budgetContext = useContext(BudgetContext); // Récupération des budgets depuis le contexte
  const budgets = budgetContext ? budgetContext.budgets : [];

  const [category, setCategory] = useState<CategoryDropdownOptions | undefined>(
    undefined
  );
  const [maximum, setMaximum] = useState<number | "">(0);
  const [theme, setTheme] = useState<string>("#277C78");

  // Met à jour les champs du formulaire si un budget est en cours d'édition
  useEffect(() => {
    if (budgetToEdit) {
      setCategory(budgetToEdit.category);
      setMaximum(budgetToEdit.maximum);
      setTheme(budgetToEdit.theme);
    } else {
      setCategory("Entertainment");
      setMaximum("");
      setTheme("#277C78");
    }
  }, [budgetToEdit]);

  // Validation et soumission du budget
  const handleSave = () => {
    if (maximum === "" || !category || !theme) return;
    onSubmit({ category, maximum: Number(maximum), theme });
    onClose(); // Fermer la popup après soumission
  };

  if (!isOpen) return null; // Ne rien afficher si la popup n'est pas ouverte

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50">
      <div className="bg-white flex flex-col gap-y-5 rounded-lg p-8 w-[560px]">
        {/* En-tête de la popup */}
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {budgetToEdit ? "Edit Budget" : "Add New Budget"}
          </h2>
          <CloseModalIcon
            className="text-grey-500 cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Message explicatif */}
        <p className="text-preset-4 text-grey-500">
          {budgetToEdit
            ? "Update your spending limits as your budgets change."
            : "Set a spending budget for the selected category."}
        </p>

        {/* Champs de formulaire */}
        <div className="flex flex-col gap-y-4">
          {/* Sélection de la catégorie */}
          <div className="self-stretch flex flex-col gap-y-1">
            <span className="text-preset-5 text-grey-500 font-bold">
              Budget Category
            </span>
            <CategoriesDropdown
              initialSelectedOption={category}
              onOptionChange={setCategory}
              label={true}
            />
          </div>

          {/* Champ de saisie pour le maximum */}
          <InputField
            label="Maximum Spend"
            name="maximumSpend"
            type="number"
            placeholder="e.g. 2000"
            prefix="$"
            value={maximum.toString()}
            onChange={(e) => setMaximum(Number(e.target.value))}
          />

          {/* Sélection du thème */}
          <div className="flex flex-col gap-y-1">
            <span className="text-preset-5 text-grey-500 font-bold">
              Budget Theme
            </span>
            <ColorsDropdown
              selectedColor={theme}
              onSelectColor={setTheme}
              existingColors={budgets} // Passe les budgets existants pour éviter les doublons de couleur
            />
          </div>
        </div>

        {/* Bouton d'action */}
        <Button onClick={handleSave} className="w-full" variant="primary">
          {budgetToEdit ? "Save Changes" : "Add Budget"}
        </Button>
      </div>
    </div>
  );
};

export default BudgetPopup;
