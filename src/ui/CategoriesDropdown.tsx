import React, { useEffect, useRef, useState } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";
import FilterMobileIcon from "@/assets/images/icon-filter-mobile.svg";

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

interface CategoryDropdownProps {
  label: boolean;
  initialSelectedOption?: CategoryDropdownOptions;
  onOptionChange?: (option: CategoryDropdownOptions) => void;
}

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

  const toggleDropdown = () => setIsOpen(!isOpen);

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
      {/* label visible uniquement sur les écrans sm (>= 640px) */}
      {label && (
        <label className="hidden sm:block text-grey-500 text-preset-4">
          Category
        </label>
      )}
      {/* Bouton pour le tri visible sur mobile uniquement */}
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
        className={`h-auto max-h-[333px] overflow-y-scroll scrollbar-thin no-scrollbar absolute sm:right-0 w-full sm:mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        } w-[177px] right-0 top-11 sm:top-[50px]`}
      >
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
