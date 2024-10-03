import React from "react";

/**
 * Props pour le composant InputField.
 * @property {string} [label] - Le texte à afficher comme étiquette pour le champ de saisie.
 * @property {string} name - Le nom de l'input, utilisé pour l'attribut HTML `name` et `id`.
 * @property {string} [type] - Le type du champ de saisie (text, password, email, etc.). Par défaut: "text".
 * @property {string} [value] - La valeur actuelle de l'input.
 * @property {string} [placeholder] - Le texte d'indication affiché lorsque l'input est vide.
 * @property {string} [helperText] - Un texte d'aide affiché sous le champ de saisie.
 * @property {JSX.Element} [icon] - Un élément icône à afficher à droite du champ de saisie.
 * @property {string} [prefix] - Un préfixe à afficher avant le texte dans l'input.
 * @property {function} [onChange] - Fonction de rappel exécutée lors du changement de la valeur du champ.
 */
interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  value?: string;
  placeholder?: string;
  helperText?: string;
  icon?: JSX.Element;
  prefix?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Composant InputField pour rendre un champ de saisie avec différentes options d'affichage.
 *
 * Ce composant prend en charge les étiquettes, les icônes, les préfixes et les textes d'aide.
 * Il est entièrement personnalisable grâce à ses props et peut être utilisé pour différents types de champs de saisie.
 *
 * @param {InputFieldProps} props - Les props nécessaires pour configurer l'InputField.
 * @returns JSX.Element
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text", // Type de champ de saisie par défaut
  value,
  placeholder,
  helperText,
  icon,
  prefix,
  onChange,
}) => {
  // Style du placeholder
  const placeholderStyle = {
    fontSize: "0.875rem",
    letterSpacing: "0px",
    lineHeight: "150%",
  };

  // Génère un ID unique pour l'input et le texte d'aide
  const helperTextId = helperText ? `${name}-helper-text` : undefined;

  return (
    <div className="w-full min-w-56">
      {/* Affiche l'étiquette si elle est définie */}
      {label && (
        <label
          htmlFor={name}
          className="block text-preset-5 font-bold text-gray-500 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative rounded-lg">
        {/* Préfixe avant le texte de l'input */}
        {prefix && (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[19px]"
            aria-hidden="true"
          >
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}

        {/* Champ de saisie */}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          aria-describedby={helperTextId}
          className={`block w-full rounded-md border-0 py-3.5 ${
            prefix ? "pl-10" : "pl-[19px]"
          } ${
            icon ? "pr-11" : "pr-[19px]"
          } text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6`}
          style={placeholderStyle}
          onChange={onChange}
        />

        {/* Icône à droite */}
        {icon && (
          <div
            className="absolute inset-y-0 right-0 flex items-center pr-[19px]"
            aria-hidden="true"
          >
            <span className={`text-gray-500`}>{icon}</span>
          </div>
        )}
      </div>

      {/* Texte d'aide affiché sous l'input */}
      {helperText && (
        <p
          id={helperTextId}
          className="mt-1 text-grey-500 text-preset-5 text-right"
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default InputField;
