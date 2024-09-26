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
  initialSelectedOption = "All Transactions", // Défaut à "All Transactions"
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
    <div className="justify-start items-center gap-2 flex">
      {/* label */}
      {label && <label className="text-grey-500 text-preset-4">Category</label>}
      {/* dropdown category */}
      <div className="flex-col justify-start items-start gap-1 inline-flex">
        <div className="relative w-full min-w-56" ref={dropdownRef}>
          {/* bouton d'ouverture de la dropdown */}
          <button
            type="button"
            onClick={toggleDropdown}
            className="inline-flex justify-between items-center w-full bg-white border border-gray-300  focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg"
          >
            <span>{selectedOption}</span>
            <CaretDownIcon
              className={`transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* dropdown */}
          <div
            role="listbox"
            className={`h-auto max-h-[333px] overflow-y-scroll scrollbar-thin no-scrollbar absolute right-0 w-full mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transform transition-all duration-300 ease-in-out ${
              isOpen
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-4 invisible"
            }`}
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
                className={`cursor-pointer  py-[14px] text-[0.9375rem] text-gray-700  transition-colors duration-200 ${
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
      </div>
    </div>
  );
};

export default CategoriesDropdown;
