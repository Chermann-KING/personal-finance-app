import { useState, useEffect, useRef } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";
import { Budget } from "@/types";

type Color = {
  name: string;
  value: string;
  used: boolean;
};

interface ColorsDropdownProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  existingBudgets: Budget[]; // Ajout des budgets existants
}

const colors: Color[] = [
  { name: "Green", value: "#277C78", used: false },
  { name: "Yellow", value: "#F2CDAC", used: false },
  { name: "Cyan", value: "#82C9D7", used: false },
  { name: "Navy", value: "#626070", used: false },
  { name: "Red", value: "#C94736", used: false },
  { name: "Purple", value: "#826CB0", used: false },
  { name: "Turquoise", value: "#597C7C", used: false },
  { name: "Brown", value: "#93674F", used: false },
  { name: "Magenta", value: "#934F6F", used: false },
  { name: "Blue", value: "#3F82B2", used: false },
  { name: "Grey", value: "#97A0AC", used: false },
  { name: "Army", value: "#7F9161", used: false },
  { name: "Pink", value: "#AF81BA", used: false },
  { name: "Gold", value: "#CAB361", used: false },
  { name: "Orange", value: "#BE6C49", used: false },
];

const ColorsDropdown: React.FC<ColorsDropdownProps> = ({
  selectedColor,
  onSelectColor,
  existingBudgets, // Recevoir les budgets existants pour vérifier les couleurs utilisées
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [availableColors, setAvailableColors] = useState<Color[]>(colors);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Vérifier les couleurs utilisées dans les budgets existants
  useEffect(() => {
    const usedColors = existingBudgets.map((budget) => budget.theme);
    const updatedColors = colors.map((color) => ({
      ...color,
      used: usedColors.includes(color.value), // Marquer comme "used" si la couleur est déjà utilisée
    }));
    setAvailableColors(updatedColors);
  }, [existingBudgets]);

  const handleSelectColor = (color: Color) => {
    onSelectColor(color.value);
    setIsOpen(false);
  };

  // Fonction permettant de gérer les clics en dehors de la dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    // Attache l'écouteur d'événement
    document.addEventListener("mousedown", handleClickOutside);

    // Nettoie l'écouteur d'événements lors du démontage du composant
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedColorName =
    availableColors.find((color) => color.value === selectedColor)?.name ??
    "Select theme";

  return (
    <div className="relative w-full min-w-56" ref={dropdownRef}>
      {/* Button to open dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full bg-white border border-gray-300 focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg"
      >
        {/* color dot & label */}
        <span className="flex items-center">
          <span
            className="h-4 w-4 rounded-full mr-3"
            style={{ backgroundColor: selectedColor }}
          ></span>
          {/* label */}
          <span className="text-gray-900 text-preset-4">
            {selectedColorName}
          </span>
        </span>
        {/* icon */}
        <CaretDownIcon className={`transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown list */}
      <div
        className={`h-[300px] overflow-y-scroll scrollbar-thin no-scrollbar absolute right-0 w-full mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {availableColors.map((color) => (
          <div
            key={color.value}
            className={`flex justify-between items-center text-[0.875rem] text-gray-900 py-3.5 ${
              color.used
                ? "text-gray-900 cursor-not-allowed"
                : "text-gray-900 hover:font-bold cursor-pointer"
            }`}
            onClick={() => !color.used && handleSelectColor(color)}
          >
            {/* dot & label */}
            <div className="flex items-center">
              {/* dot */}
              <span
                className={`h-4 w-4 rounded-full mr-3 ${
                  color.used ? "opacity-10" : "opacity-100"
                }`}
                style={{ backgroundColor: color.value }}
              ></span>
              {/* label */}
              <span
                className={`${color.used ? "text-gray-900" : "text-gray-900"}`}
              >
                {color.name}
              </span>
            </div>
            {/* status */}
            {color.used && (
              <span className="text-[0.875rem]">Already used</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorsDropdown;
