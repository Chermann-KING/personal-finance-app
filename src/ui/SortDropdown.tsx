import React, { useState, useEffect, useRef } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";
import SortMobileIcon from "@/assets/images/icon-sort-mobile.svg";

/**
 * Les options disponibles pour le tri dans le menu déroulant.
 * @typedef {"Latest" | "Oldest" | "A to Z" | "Z to A" | "Highest" | "Lowest"} SortDropdownOptions
 */
type SortDropdownOptions =
  | "Latest"
  | "Oldest"
  | "A to Z"
  | "Z to A"
  | "Highest"
  | "Lowest";

/**
 * Props pour le composant SortDropdown.
 * @property {boolean} label - Indique si un label de tri doit être affiché (visible uniquement sur les grands écrans).
 * @property {function} setSortBy - Fonction de rappel pour mettre à jour l'option de tri sélectionnée.
 * @property {function} setCurrentPage - Fonction de rappel pour remettre la pagination à la première page lors du changement de tri.
 */
interface SortDropdownProps {
  label: boolean;
  setSortBy: (value: SortDropdownOptions) => void;
  setCurrentPage: (value: number) => void;
}

/**
 * Composant SortDropdown pour trier les éléments selon différentes options.
 *
 * Ce composant est réactif et s'adapte aux différentes tailles d'écrans. Sur mobile, un bouton d'icône
 * déclenche l'ouverture du menu déroulant, tandis que sur les écrans plus larges, un bouton "Sort by" est utilisé.
 *
 * @param {SortDropdownProps} props - Les props nécessaires pour configurer le SortDropdown.
 * @returns JSX.Element
 */
const SortDropdown: React.FC<SortDropdownProps> = ({
  label,
  setSortBy,
  setCurrentPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SortDropdownOptions>("Latest");
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(
    null
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /**
   * Liste des options de le dropdown.
   */
  const options: SortDropdownOptions[] = [
    "Latest",
    "Oldest",
    "A to Z",
    "Z to A",
    "Highest",
    "Lowest",
  ];

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
   * Change l'option de tri sélectionnée.
   * @param {SortDropdownOptions} option - L'option de tri sélectionnée.
   * @param {React.MouseEvent} e - L'événement de clic pour arrêter la propagation.
   */
  const handleOptionChange = (
    option: SortDropdownOptions,
    e: React.MouseEvent | React.KeyboardEvent
  ) => {
    e.stopPropagation();
    setSelectedOption(option);
    setSortBy(option);
    setIsOpen(false);
    setCurrentPage(1); // Réinitialise la pagination à la première page lors du changement de tri
    buttonRef.current?.focus(); // Remet le focus sur le bouton après sélection
  };

  /**
   * Gestion de la navigation au clavier pour le dropdown
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) {
      return; // Ne gère pas les événements du clavier si le dropdown est fermé
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedOptionIndex((prev) =>
        prev === null || prev === options.length - 1 ? 0 : prev + 1
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedOptionIndex((prev) =>
        prev === null || prev === 0 ? options.length - 1 : prev - 1
      );
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (focusedOptionIndex !== null) {
        handleOptionChange(options[focusedOptionIndex], event);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus(); // Retour au bouton lorsque la touche échap est pressée
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
      className="max-w-[172px] relative flex justify-between items-center"
      ref={dropdownRef}
    >
      {/* Label visible uniquement sur les écrans sm (>= 640px) */}
      {label && (
        <label className="hidden sm:block text-grey-500 text-preset-4 mr-2 text-nowrap">
          Sort by
        </label>
      )}
      {/* Bouton pour le tri visible sur mobile uniquement */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-controls="sort-options"
        aria-haspopup="listbox"
        className="sm:hidden flex items-center justify-center p-2 focus:border-gray-900 focus:outline-none"
      >
        <SortMobileIcon aria-label="Sort by option" />
      </button>
      {/* Bouton d'ouverture du dropdown visible uniquement sur les écrans sm (>= 640px) */}
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="sort-options"
        className="hidden sm:inline-flex justify-between items-center w-[113px] bg-white border border-gray-300 focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg"
      >
        <span>{selectedOption}</span>
        <CaretDownIcon
          className={`transform ${isOpen ? "rotate-180" : ""}`}
          aria-label="Toggle dropdown"
        />
      </button>
      {/* Dropdown menu visible après clic sur l'icône de tri (mobile) ou bouton (desktop) */}
      {isOpen && (
        <div
          id="sort-options"
          role="listbox"
          className={`w-[114px] h-auto max-h-[333px] overflow-y-scroll scrollbar-thin no-scrollbar absolute right-0 mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transform transition-all duration-300 ease-in-out ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-2 invisible"
          } right-0 top-9 sm:top-[50px]`}
        >
          {/* Options de tri */}
          {options.map((option, index) => (
            <div
              key={option}
              className={`cursor-pointer py-[14px] text-[0.9375rem] text-gray-700 transition-colors duration-200 ${
                selectedOption === option ? "font-bold" : "hover:font-bold"
              } ${focusedOptionIndex === index ? "font-bold" : ""}`}
              onClick={(e) => handleOptionChange(option, e)}
              role="option"
              aria-selected={selectedOption === option}
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

export default SortDropdown;
