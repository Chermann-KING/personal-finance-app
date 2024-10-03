import React, { useEffect, useRef, useState } from "react";
import EllipsisIcon from "@/assets/images/icon-ellipsis.svg";

/**
 * Props pour le composant DropdownMenu.
 * @property {function} onEdit - Fonction déclenchée lors de la sélection de l'option d'édition.
 * @property {function} onDelete - Fonction déclenchée lors de la sélection de l'option de suppression.
 * @property {string} editLabel - Libellé à afficher pour l'option d'édition.
 * @property {string} deleteLabel - Libellé à afficher pour l'option de suppression.
 */
interface DropdownMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  editLabel: string;
  deleteLabel: string;
}

/**
 * Composant DropdownMenu pour afficher un menu contextuel avec des options d'édition et de suppression.
 * Ce menu se contrôle à la fois à la souris et au clavier pour garantir l'accessibilité.
 *
 * @param {DropdownMenuProps} props - Les propriétés nécessaires pour configurer le DropdownMenu.
 * @returns JSX.Element
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false); // État indiquant si le menu est ouvert
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null); // Indice de l'option actuellement focalisée
  const dropdownRef = useRef<HTMLDivElement>(null); // Référence pour la gestion des clics à l'extérieur du menu
  const buttonRef = useRef<HTMLButtonElement>(null); // Référence pour le bouton du menu
  const menuItemsRef = useRef<Array<HTMLLIElement | null>>([]); // Référence pour les éléments du menu

  /**
   * Ouvre ou ferme le menu déroulant et réinitialise l'index de focus.
   */
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setFocusedIndex(null); // Réinitialise l'index du focus
  };

  // Gestion du clic en dehors du menu pour le fermer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Ferme le menu si on clique à l'extérieur
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Gère la navigation au clavier dans le menu.
   *
   * @param {React.KeyboardEvent} event - L'événement clavier à gérer.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((prev) => (prev === null || prev === 1 ? 0 : prev + 1)); // Passe à l'élément suivant
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((prev) => (prev === null || prev === 0 ? 1 : prev - 1)); // Passe à l'élément précédent
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (focusedIndex === 0) {
        onEdit(); // Exécuter la fonction d'édition si l'élément est sélectionné
      } else if (focusedIndex === 1) {
        onDelete(); // Exécute la fonction de suppression si l'élément est sélectionné
      }
      setIsOpen(false); // Ferme le menu après sélection
    }

    if (event.key === "Escape") {
      setIsOpen(false); // Ferme le menu si la touche Échap est pressée
      buttonRef.current?.focus(); // Reviens au bouton
    }
  };

  // Gère le focus sur les éléments du menu lors de leur apparition
  useEffect(() => {
    if (focusedIndex !== null && menuItemsRef.current[focusedIndex]) {
      menuItemsRef.current[focusedIndex]?.focus(); // Focus sur l'élément focalisé
    }
  }, [focusedIndex]);

  // Ouvre le menu et donne le focus à la première option
  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(true); // Ouvre le menu au clavier
      setFocusedIndex(0); // Focalise la première option
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
