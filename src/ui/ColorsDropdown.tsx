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
  const [availableColors, setAvailableColors] = useState<Color[]>(colors);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        type="button"
        onClick={() => setIsOpen(!isOpen)}
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
        <CaretDownIcon className={`transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Liste déroulante des couleurs */}
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
