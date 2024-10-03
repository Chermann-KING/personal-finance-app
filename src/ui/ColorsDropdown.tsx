import { useState, useEffect, useRef } from "react";
import CaretDownIcon from "@/assets/images/icon-caret-down.svg";

/**
 * Type représentant un propriétaire de couleur.
 * @typedef {Object} ColorOwner
 * @property {string} theme - La couleur utilisée (valeur hexadécimale).
 */
interface ColorOwner {
  theme: string;
}

/**
 * Type représentant une couleur.
 * @typedef {Object} Color
 * @property {string} name - Le nom de la couleur.
 * @property {string} value - La valeur hexadécimale de la couleur.
 * @property {boolean} used - Indique si la couleur est déjà utilisée.
 */
type Color = {
  name: string;
  value: string;
  used: boolean;
};

/**
 * Props pour le composant ColorsDropdown.
 * @property {string} selectedColor - La couleur actuellement sélectionnée (valeur hexadécimale).
 * @property {function} onSelectColor - Fonction de rappel pour mettre à jour la couleur sélectionnée.
 * @property {ColorOwner[]} existingColors - Tableau des couleurs déjà utilisées dans d'autres contextes (budgets ou pots).
 */
interface ColorsDropdownProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  existingColors: ColorOwner[];
}

/**
 * Tableau contenant les couleurs disponibles pour la sélection.
 *
 * Chaque objet dans ce tableau représente une couleur avec trois propriétés :
 * - `name` : Le nom de la couleur (ex: "Green").
 * - `value` : La valeur hexadécimale de la couleur (ex: "#277C78").
 * - `used` : Un booléen qui indique si la couleur est déjà utilisée ou non (par défaut: `false`).
 *
 * Ce tableau est utilisé pour fournir des options de couleurs dans le composant `ColorsDropdown`.
 * Les couleurs marquées comme `used: true` sont désactivées et ne peuvent pas être sélectionnées.
 * Les couleurs sont affichées avec leur nom et un point coloré pour chaque option.
 *
 * @typedef {Object} Color
 * @property {string} name - Le nom de la couleur.
 * @property {string} value - La valeur hexadécimale de la couleur.
 * @property {boolean} used - Indique si la couleur est déjà utilisée ou non.
 */
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

/**
 * Composant ColorsDropdown pour sélectionner une couleur.
 *
 * Ce composant affiche une liste de couleurs disponibles et gère l'état de celles qui sont déjà utilisées.
 * Il permet de sélectionner une couleur non utilisée pour la passer à un composant parent via la fonction `onSelectColor`.
 *
 * @param {ColorsDropdownProps} props - Les props nécessaires pour configurer le ColorsDropdown.
 * @returns JSX.Element
 */
const ColorsDropdown: React.FC<ColorsDropdownProps> = ({
  selectedColor,
  onSelectColor,
  existingColors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedColorIndex, setFocusedColorIndex] = useState<number | null>(
    null
  );
  const [availableColors, setAvailableColors] = useState<Color[]>(colors);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  // Vérifie les couleurs utilisées et met à jour l'état des couleurs disponibles
  useEffect(() => {
    const usedColors = existingColors.map((item) => item.theme);
    const updatedColors = colors.map((color) => ({
      ...color,
      used: usedColors.includes(color.value), // Marque la couleur comme utilisée si elle est présente dans `existingColors`
    }));
    setAvailableColors(updatedColors);
  }, [existingColors]);

  /**
   * Gère la sélection d'une couleur et ferme la liste déroulante.
   * @param {Color} color - La couleur sélectionnée.
   */
  const handleSelectColor = (color: Color) => {
    onSelectColor(color.value);
    setIsOpen(false);
    buttonRef.current?.focus();
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

  /**
   * Gère la navigation clavier pour les options de couleur.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedColorIndex((prev) => {
        let nextIndex =
          prev === null || prev === availableColors.length - 1 ? 0 : prev + 1;
        while (availableColors[nextIndex].used) {
          nextIndex =
            nextIndex === availableColors.length - 1 ? 0 : nextIndex + 1;
        }
        scrollToOption(nextIndex);
        return nextIndex;
      });
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedColorIndex((prev) => {
        let prevIndex =
          prev === null || prev === 0 ? availableColors.length - 1 : prev - 1;
        while (availableColors[prevIndex].used) {
          prevIndex =
            prevIndex === 0 ? availableColors.length - 1 : prevIndex - 1;
        }
        scrollToOption(prevIndex);
        return prevIndex;
      });
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (
        focusedColorIndex !== null &&
        !availableColors[focusedColorIndex].used
      ) {
        handleSelectColor(availableColors[focusedColorIndex]);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  /**
   * Ferme la liste déroulante si un clic est effectué en dehors du composant.
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

  const selectedColorName =
    availableColors.find((color) => color.value === selectedColor)?.name ??
    "Select theme";

  return (
    <div className="relative w-full min-w-56" ref={dropdownRef}>
      {/* Bouton pour ouvrir le dropdown */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="inline-flex justify-between items-center w-full bg-white border border-gray-300 focus:border-gray-900 focus:outline-none text-[0.875rem] font-normal text-gray-900 px-[19px] py-[14px] rounded-lg"
      >
        {/* Point de couleur et libellé */}
        <span className="flex items-center">
          <span
            className="h-4 w-4 rounded-full mr-3"
            style={{ backgroundColor: selectedColor }}
          ></span>
          <span className="text-gray-900 text-preset-4">
            {selectedColorName}
          </span>
        </span>
        <CaretDownIcon
          className={`transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Liste déroulante des couleurs */}
      <div
        id="color-options"
        role="listbox"
        aria-activedescendant={
          focusedColorIndex !== null
            ? availableColors[focusedColorIndex].name
            : undefined
        }
        tabIndex={-1}
        ref={optionsContainerRef}
        className={`h-[300px] overflow-y-scroll scrollbar-thin no-scrollbar absolute right-0 w-full mt-2 rounded-lg shadow-custom bg-white z-10 divide-y divide-solid divide-grey-100 px-[19px] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
        style={{ transitionProperty: "opacity, transform" }}
      >
        {availableColors.map((color, index) => (
          <div
            key={color.value}
            role="option"
            aria-selected={selectedColor === color.value}
            aria-disabled={color.used}
            tabIndex={-1}
            className={`flex justify-between items-center text-[0.875rem] text-gray-900 py-3.5 ${
              color.used
                ? "text-gray-900 cursor-not-allowed"
                : "text-gray-900 hover:font-bold cursor-pointer"
            } ${focusedColorIndex === index ? "font-bold" : ""}`}
            onClick={() => !color.used && handleSelectColor(color)}
          >
            {/* Point de couleur et étiquette */}
            <div className="flex items-center">
              <span
                className={`h-4 w-4 rounded-full mr-3 ${
                  color.used ? "opacity-10" : "opacity-100"
                }`}
                style={{ backgroundColor: color.value }}
              ></span>
              <span
                className={`${color.used ? "text-gray-900" : "text-gray-900"}`}
              >
                {color.name}
              </span>
            </div>
            {/* État de la couleur */}
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
