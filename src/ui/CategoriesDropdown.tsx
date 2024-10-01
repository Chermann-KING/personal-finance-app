import React, { useEffect, useRef, useState } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";
import FilterMobileIcon from "@/assets/images/icon-filter-mobile.svg";

/**
 * Les options disponibles pour le menu déroulant de catégories.
 * @typedef {"All Transactions" | "Entertainment" | "Bills" | "Groceries" | "Dining Out" | "Transportation" | "Personal Care" | "Education" | "Lifestyle" | "Shopping" | "General"} CategoryDropdownOptions
 */
export type CategoryDropdownOptions =
  | "All Transactions"
  | "Entertainment"
  | "Bills"
  | "Groceries"
  | "Dining Out"
  | "Transportation"
  | "Personal Care"
  | "Education"
  | "Lifestyle"
  | "Shopping"
  | "General";

/**
 * Props pour le composant CategoriesDropdown.
 * @property {boolean} label - Indique si un label "Category" doit être affiché (visible uniquement sur les grands écrans).
 * @property {CategoryDropdownOptions} [initialSelectedOption] - L'option de catégorie initialement sélectionnée. Par défaut: "All Transactions".
 * @property {function} [onOptionChange] - Fonction de rappel pour notifier le changement de l'option sélectionnée.
 */
interface CategoryDropdownProps {
  label: boolean;
  initialSelectedOption?: CategoryDropdownOptions;
  onOptionChange?: (option: CategoryDropdownOptions) => void;
}

/**
 * Composant CategoriesDropdown pour permettre à l'utilisateur de sélectionner une catégorie.
 *
 * Ce composant est réactif et s'adapte aux différentes tailles d'écrans. Sur mobile, un bouton d'icône
 * déclenche l'ouverture du menu déroulant, tandis que sur les écrans plus larges, un bouton "Category" est utilisé.
 *
 * @param {CategoryDropdownProps} props - Les props nécessaires pour configurer le CategoriesDropdown.
 * @returns JSX.Element
 */
const CategoriesDropdown: React.FC<CategoryDropdownProps> = ({
  label,
  initialSelectedOption = "All Transactions",
  onOptionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CategoryDropdownOptions>(
    initialSelectedOption
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Ouvre ou ferme le menu déroulant.
   */
  const toggleDropdown = () => setIsOpen(!isOpen);

  /**
   * Change l'option de catégorie sélectionnée.
   * @param {CategoryDropdownOptions} option - L'option de catégorie sélectionnée.
   * @param {React.MouseEvent} e - L'événement de clic pour arrêter la propagation.
   */
  const handleOptionChange = (
    option: CategoryDropdownOptions,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedOption(option);
    if (onOptionChange) {
      onOptionChange(option);
    }
    setIsOpen(false);
  };

  /**
   * Ferme le menu déroulant si un clic est effectué en dehors du composant.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="max-w-[245px] relative flex justify-end items-center gap-x-2"
      ref={dropdownRef}
    >
      {/* Label visible uniquement sur les écrans sm (>= 640px) */}
      {label && (
        <label className="hidden sm:block text-grey-500 text-preset-4">
          Category
        </label>
      )}
      {/* Bouton pour le filtre visible sur mobile uniquement */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="sm:hidden flex items-center justify-center p-2 focus:border-gray-900 focus:outline-none text-sm"
      >
        <FilterMobileIcon />
      </button>
      {/* Bouton d'ouverture du dropdown visible uniquement sur les écrans sm (>= 640px) */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="hidden sm:inline-flex justify-between items-center w-[177px] bg-white border border-gray-300 focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg"
      >
        <span>{selectedOption}</span>
        <CaretDownIcon className={`transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {/* Dropdown menu visible après clic sur l'icône de filtre (mobile) ou bouton (desktop) */}
      <div
        role="listbox"
        className={`w-[177px] h-auto max-h-[333px] overflow-y-scroll scrollbar-thin no-scrollbar absolute sm:right-0 sm:mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }right-0 top-11 sm:top-[50px]`}
      >
        {/* Options de catégories */}
        {(
          [
            "All Transactions",
            "Entertainment",
            "Bills",
            "Groceries",
            "Dining Out",
            "Transportation",
            "Personal Care",
            "Education",
            "Lifestyle",
            "Shopping",
            "General",
          ] as CategoryDropdownOptions[]
        ).map((option) => (
          <div
            key={option}
            className={`cursor-pointer py-[14px] text-[0.9375rem] text-gray-700 transition-colors duration-200 ${
              selectedOption === option ? " font-bold" : "hover:font-bold"
            }`}
            onClick={(e) => handleOptionChange(option, e)}
            role="option"
            aria-selected={selectedOption === option}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesDropdown;
