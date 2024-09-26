import React, { useState, useEffect, useRef } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";
import SortMobileIcon from "@/assets/images/icon-sort-mobile.svg";

type SortDropdownOptions =
  | "Latest"
  | "Oldest"
  | "A to Z"
  | "Z to A"
  | "Highest"
  | "Lowest";

interface SortDropdownProps {
  label: boolean;
  setSortBy: (value: SortDropdownOptions) => void;
  setCurrentPage: (value: number) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  label,
  setSortBy,
  setCurrentPage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<SortDropdownOptions>("Latest");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = (
    option: SortDropdownOptions,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedOption(option);
    setSortBy(option);
    setIsOpen(false);
    setCurrentPage(1);
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
      className="max-w-[172px] relative flex justify-between items-center"
      ref={dropdownRef}
    >
      {/* label visible uniquement sur les écrans sm (>= 640px) */}
      {label && (
        <label className="hidden sm:block text-grey-500 text-preset-4 mr-2 text-nowrap">
          Sort by
        </label>
      )}
      {/* Bouton pour le tri visible sur mobile uniquement */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="sm:hidden flex items-center justify-center p-2 focus:border-gray-900 focus:outline-none"
      >
        <SortMobileIcon />
      </button>
      {/* Bouton d'ouverture du dropdown visible uniquement sur les écrans sm (>= 640px) */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="hidden sm:inline-flex justify-between items-center w-[113px] bg-white border border-gray-300 focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg"
      >
        <span>{selectedOption}</span>
        <CaretDownIcon className={`transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {/* Dropdown menu visible après clic sur l'icône de tri (mobile) ou bouton (desktop) */}
      <div
        role="listbox"
        className={`h-auto max-h-[333px] overflow-y-scroll scrollbar-thin no-scrollbar absolute right-0 w-full mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        } w-[114px] right-0 top-9 sm:top-[50px]`}
      >
        {[
          { label: "Latest", value: "Latest" },
          { label: "Oldest", value: "Oldest" },
          { label: "A to Z", value: "A to Z" },
          { label: "Z to A", value: "Z to A" },
          { label: "Highest", value: "Highest" },
          { label: "Lowest", value: "Lowest" },
        ].map((option) => (
          <div
            key={option.value}
            className={`cursor-pointer py-[14px] text-[0.9375rem] text-gray-700 transition-colors duration-200 ${
              selectedOption === option.label ? "font-bold" : "hover:font-bold"
            }`}
            onClick={(e) =>
              handleOptionChange(option.value as SortDropdownOptions, e)
            }
            role="option"
            aria-selected={selectedOption === option.label}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown;
