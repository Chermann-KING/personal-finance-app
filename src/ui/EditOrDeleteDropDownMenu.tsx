import React, { useEffect, useRef, useState } from "react";
import EllipsisIcon from "@/assets/images/icon-ellipsis.svg";

interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemsRef = useRef<Array<HTMLLIElement | null>>([]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setFocusedIndex(null); // Reset focus index
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

  // Gestion de la navigation au clavier
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prev) => (prev === null || prev === 1 ? 0 : prev + 1));
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prev) => (prev === null || prev === 0 ? 1 : prev - 1));
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (focusedIndex === 0) {
        onEdit();
      } else if (focusedIndex === 1) {
        onDelete();
      }
      setIsOpen(false);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  // Gérer le focus sur les éléments du menu lors de leur apparition
  useEffect(() => {
    if (focusedIndex !== null && menuItemsRef.current[focusedIndex]) {
      menuItemsRef.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  // Ouvrir le menu et donner le focus à la première option
  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton d'ouverture du dropdown */}
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
        onKeyDown={handleButtonKeyDown} // Gestion de l'ouverture par clavier
        className="text-grey-500 cursor-pointer p-1"
      >
        <EllipsisIcon />
      </button>

      {/* Menu dropdown */}
      {isOpen && (
        <div
          id="dropdown-menu"
          role="menu"
          aria-hidden={!isOpen}
          className={`absolute right-0 w-[136px] px-5 py-3 mt-2 bg-white shadow-lg rounded-md transition-all duration-300 ease-in-out transform ${
            isOpen
              ? "opacity-100 translate-y-0 visible"
              : "opacity-0 -translate-y-4 invisible"
          } z-10`}
          onKeyDown={handleKeyDown} // Gestion des touches du menu
        >
          <ul className="divide-y divide-grey-100" role="menu">
            <li
              ref={(el) => {
                menuItemsRef.current[0] = el;
              }}
              className={` focus:outline-none focus:ring-1 focus:ring-offset-1 py-3 text-preset-4 text-grey-900 cursor-pointer ${
                focusedIndex === 0 ? "font-bold  focus:ring-transparent" : ""
              } `}
              role="menuitem"
              tabIndex={focusedIndex === 0 ? 0 : -1}
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }}
            >
              {editLabel}
            </li>
            <li
              ref={(el) => {
                menuItemsRef.current[1] = el;
              }}
              className={`focus:outline-none focus:ring-1 focus:ring-offset-1 py-3 text-preset-4 text-red cursor-pointer ${
                focusedIndex === 1 ? "font-bold focus:ring-transparent" : ""
              } `}
              role="menuitem"
              tabIndex={focusedIndex === 1 ? 0 : -1}
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }}
            >
              {deleteLabel}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
