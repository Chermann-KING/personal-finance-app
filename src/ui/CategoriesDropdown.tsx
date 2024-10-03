import React, { useEffect, useRef, useState } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";
import FilterMobileIcon from "@/assets/images/icon-filter-mobile.svg";
import { useBudget } from "@/context/BudgetContext";

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
 * @property {boolean} [inPopup] - Optionnel. Indique si le dropdown est utilisé dans une popup.
 * Lorsque cette option est activée, l'affichage est modifié pour occuper toute la largeur,
 * et l'icône de dropdown est masquée.
 * @property {boolean} inBudgetContext - Indique si le dropdown est utilisé dans le contexte des budgets.
 */
interface CategoryDropdownProps {
  label: boolean;
  initialSelectedOption?: CategoryDropdownOptions;
  onOptionChange?: (option: CategoryDropdownOptions) => void;
  inPopup?: boolean;
  inBudgetContext: boolean;
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
  inPopup = false, // Valeur par défaut false
  inBudgetContext = true,
}) => {
  const budgetContext = useBudget();
  const budgets = inBudgetContext ? budgetContext.budgets : [];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<CategoryDropdownOptions>(
    initialSelectedOption
  );
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(
    null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Liste des options de le dropdown.
   */
  const categories: CategoryDropdownOptions[] = [
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
  ];

  /**
   * Désactiver la catégorie "All Transactions" et les catégories déjà utilisées si dans une popup.
   */
  const disabledCategories = new Set(
    inPopup
      ? ["All Transactions", ...budgets.map((budget) => budget.category)]
      : []
  );

  /**
   * Ouvre ou ferme le menu déroulant.
   */
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setFocusedOptionIndex(null);
    }
  };

  /**
   * Change l'option de catégorie sélectionnée.
   * @param {CategoryDropdownOptions} option - L'option de catégorie sélectionnée.
   * @param {React.MouseEvent} e - L'événement de clic pour arrêter la propagation.
   */
  const handleOptionChange = (
    option: CategoryDropdownOptions,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.preventDefault();
    if (!disabledCategories.has(option)) {
      setSelectedOption(option);
      if (onOptionChange) {
        onOptionChange(option);
      }
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  /**
   * Fonction pour faire défiler l'option dans la zone visible.
   */
  const scrollToOption = (index: number) => {
    const container = optionsContainerRef.current;
    const optionElement = container?.children[index] as HTMLElement;

    if (optionElement && container) {
      const optionTop = optionElement.offsetTop;
      const optionBottom = optionTop + optionElement.offsetHeight;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.offsetHeight;

      if (optionBottom > containerBottom) {
        container.scrollTop = optionBottom - container.offsetHeight;
      } else if (optionTop < containerTop) {
        container.scrollTop = optionTop;
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      return; // Ne gère pas les événements du clavier si le dropdown est fermé
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedOptionIndex((prev) => {
        const nextIndex =
          prev === null || prev === categories.length - 1 ? 0 : prev + 1;
        scrollToOption(nextIndex);
        return nextIndex;
      });
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedOptionIndex((prev) => {
        const prevIndex =
          prev === null || prev === 0 ? categories.length - 1 : prev - 1;
        scrollToOption(prevIndex);
        return prevIndex;
      });
    }

    if (event.key === "Enter" || event.key === " ") {
      if (focusedOptionIndex !== null) {
        handleOptionChange(categories[focusedOptionIndex], event);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
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
      className={`${
        inPopup ? "w-full" : "max-w-[245px]"
      } relative flex justify-end items-center gap-x-2`}
      ref={dropdownRef}
    >
      {/* Label visible uniquement sur les écrans sm (>= 640px) */}
      {label && !inPopup && (
        <label className="hidden sm:block text-grey-500 text-preset-4">
          Category
        </label>
      )}
      {/* Bouton pour le filtre visible sur mobile uniquement */}
      {!inPopup && (
        <button
          ref={buttonRef}
          type="button"
          onClick={toggleDropdown}
          className="sm:hidden flex items-center justify-center p-2 focus:border-gray-900 focus:outline-none text-sm"
        >
          <FilterMobileIcon
            aria-label="Filter by category"
            aria-hidden="true"
          />
        </button>
      )}
      {/* Bouton d'ouverture du dropdown visible uniquement sur les écrans sm (>= 640px) */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-label="Open category dropdown"
        className={`${
          inPopup
            ? "w-full flex justify-between items-center"
            : "hidden sm:inline-flex justify-between items-center w-[177px]"
        } bg-white border border-gray-300 focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg`}
      >
        <span>{selectedOption}</span>
        <CaretDownIcon
          className={`transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {/* Dropdown menu visible après clic sur l'icône de filtre (mobile) ou bouton (desktop) */}
      {isOpen && (
        <div
          id="category-dropdown-options"
          role="listbox"
          ref={optionsContainerRef}
          className={`w-[177px] h-auto max-h-[333px] overflow-y-scroll scrollbar-thin no-scrollbar absolute sm:right-0 sm:mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "block opacity-100 translate-y-0 visible"
              : "hidden opacity-0 -translate-y-2 invisible"
          }right-0 top-11 sm:top-[50px]`}
        >
          {/* Options de catégories */}
          {categories.map((option, index) => (
            <div
              key={option}
              className={`py-[14px] text-[0.9375rem] text-gray-700 transition-colors duration-200 ${
                selectedOption === option ? "font-bold" : "hover:font-bold"
              }  ${focusedOptionIndex === index ? "font-bold" : ""} ${
                disabledCategories.has(option)
                  ? "text-gray-300 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
              onClick={(e) => handleOptionChange(option, e)}
              role="option"
              aria-selected={selectedOption === option}
              aria-disabled={disabledCategories.has(option)}
              tabIndex={-1}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesDropdown;
