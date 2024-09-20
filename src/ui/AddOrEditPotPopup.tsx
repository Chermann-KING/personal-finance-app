import React, { useState, useEffect, useContext } from "react";
import CloseModalIcon from "@/assets/images/icon-close-modal.svg";
import InputField from "@/ui/InputField";
import Button from "@/ui/Button";
import ColorsDropdown from "@/ui/ColorsDropdown";
import { PotContext } from "@/context/PotContext";

interface PotPopupProps {
  isOpen: boolean;
  onClose: () => void;
  potToEdit?: {
    name: string;
    target: number;
    theme: string;
  } | null; // Ajouter null ici
  onSubmit: (pot: { name: string; target: number; theme: string }) => void;
}

const PotPopup: React.FC<PotPopupProps> = ({
  isOpen,
  onClose,
  potToEdit,
  onSubmit,
}) => {
  const potContext = useContext(PotContext); // Récupérer les pots depuis le contexte
  const pots = potContext ? potContext.pots : [];

  const [name, setName] = useState<string>("");
  const [target, setTarget] = useState<number | "">(0);
  const [theme, setTheme] = useState("#277C78");

  // Met à jour les valeurs des champs si `potToEdit` change
  useEffect(() => {
    if (potToEdit) {
      setName(potToEdit.name);
      setTarget(potToEdit.target);
      setTheme(potToEdit.theme);
    } else {
      setName("");
      setTarget("");
      setTheme("Green");
    }
  }, [potToEdit]);

  const handleSave = () => {
    if (!name || target === "" || !theme) return;
    onSubmit({ name, target: Number(target), theme });
    onClose(); // Fermer la popup après soumission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-0 flex justify-center items-center z-50">
      <div className="bg-white flex flex-col gap-y-5 rounded-lg p-8 w-[560px]">
        <div className="flex justify-between items-center">
          <h2 className="text-preset-1 text-grey-900 font-bold">
            {potToEdit ? "Edit Pot" : "Add New Pot"}
          </h2>
          <CloseModalIcon
            className="text-grey-500 cursor-pointer"
            onClick={onClose}
          />
        </div>
        <p className="text-preset-4 text-grey-500">
          {potToEdit
            ? "Update your saving targets as your goals change."
            : "Set a savings target for this pot."}
        </p>
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
          <div className="flex flex-col gap-y-1">
            <span className="text-preset-5 text-grey-500 font-bold">
              Budget Theme
            </span>
            <ColorsDropdown
              selectedColor={theme}
              onSelectColor={setTheme}
              existingColors={pots}
            />
          </div>
        </div>
        <Button onClick={handleSave} className="w-full" variant="primary">
          {potToEdit ? "Save Changes" : "Add Pot"}
        </Button>
      </div>
    </div>
  );
};

export default PotPopup;
