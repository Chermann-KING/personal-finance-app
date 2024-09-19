import React, { useState, useEffect } from "react";
import CategoriesDropdown from "@/ui/CategoriesDropdown";
import ColorsDropdown from "@/ui/ColorsDropdown";
import InputField from "@/ui/InputField";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import Button from "./Button";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  budgetToEdit?: {
    category: string;
    maximum: number;
    theme: string;
  }; // null si on ajoute un nouveau budget
  onSubmit: (budget: {
    category: string;
    maximum: number;
    theme: string;
  }) => void;
}

const BudgetPopup: React.FC<PopupProps> = ({
  isOpen,
  onClose,
  budgetToEdit,
  onSubmit,
}) => {
  const [category, setCategory] = useState("Entertainment");
  const [maximum, setMaximum] = useState<number | "">(0);
  const [theme, setTheme] = useState("#277C78");

  // Met à jour les valeurs des champs si `budgetToEdit` change
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
  }, [budgetToEdit]); // Ce `useEffect` s'exécute à chaque changement de `budgetToEdit`

  const handleSave = () => {
    if (maximum === "" || !category || !theme) return;
    onSubmit({ category, maximum: Number(maximum), theme });
    onClose(); // Fermer la popup après soumission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50">
      <div className="bg-white flex flex-col gap-y-5 rounded-lg p-8 w-[560px]">
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {budgetToEdit ? "Edit Budget" : "Add New Budget"}
          </h2>
          <CloseModalIcon
            className="text-grey-500 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <p className="text-sm text-gray-500">
          {budgetToEdit
            ? "Update your spending limits as your budgets change."
            : "Set a spending budget for the selected category."}
        </p>
        <div className="flex flex-col gap-y-4">
          <div className="self-stretch flex flex-col gap-y-1">
            <span className="text-preset-5 text-grey-500 font-bold">
              Budget Category
            </span>
            <CategoriesDropdown
              initialSelectedOption={category as any}
              onOptionChange={setCategory}
            />
          </div>
          <InputField
            label="Maximum Spend"
            name="maximumSpend"
            type="number"
            placeholder="e.g. 2000"
            prefix="$"
            value={maximum.toString()}
            onChange={(e) => setMaximum(Number(e.target.value))}
          />
          <div className="flex flex-col gap-y-1">
            <span className="text-preset-5 text-grey-500 font-bold">
              Budget Theme
            </span>
            <ColorsDropdown selectedColor={theme} onSelectColor={setTheme} />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full" variant="primary">
          {budgetToEdit ? "Save Changes" : "Add Budget"}
        </Button>
      </div>
    </div>
  );
};

export default BudgetPopup;
