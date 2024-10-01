import React from "react";
import CaretRightIcon from "@/assets/images/icon-caret-right.svg";

/**
 * Types de variantes disponibles pour le bouton.
 * @typedef {"primary" | "secondary" | "tertiary" | "destroy"} ButtonVariant
 */
type ButtonVariant = "primary" | "secondary" | "tertiary" | "destroy";

/**
 * Props pour le composant Button.
 * @property {"submit" | "reset" | "button"} [type] - Le type du bouton (submit, reset ou button). Par défaut: "button".
 * @property {ButtonVariant} variant - La variante du style du bouton.
 * @property {React.ReactNode} children - Le contenu à afficher à l'intérieur du bouton.
 * @property {function} [onClick] - Fonction de rappel pour gérer le clic sur le bouton.
 * @property {boolean} [disabled] - Désactiver le bouton (true ou false).
 * @property {string} [className] - Classes CSS supplémentaires pour personnaliser le bouton.
 */
interface ButtonProps {
  type?: "submit" | "reset" | "button";
  variant: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Composant Button réutilisable avec plusieurs variantes de style.
 *
 * Le bouton peut afficher un contenu enfant (children) et appliquer différentes variantes (primary, secondary, etc.).
 * Il gère également les états désactivés et les clics via des props.
 *
 * @param {ButtonProps} props - Les props nécessaires pour configurer le Button.
 * @returns JSX.Element
 */
const Button: React.FC<ButtonProps> = ({
  type = "button", // Type de bouton par défaut
  variant,
  children,
  onClick,
  disabled,
  className,
}) => {
  // Styles de base du bouton
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg px-[17px] py-5 text-preset-4 font-bold transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  // Styles conditionnels selon la variante
  const variantStyles = {
    primary: "bg-grey-900 text-white hover:bg-grey-500 focus:ring-grey-500",
    secondary:
      "bg-beige-100 text-grey-900 border border-beige-100 hover:bg-white hover:border-beige-500 focus:ring-beige-100",
    tertiary: "text-grey-500 hover:text-grey-900 focus:ring-grey-500",
    destroy: "bg-red text-white hover:opacity-80 focus:ring-red",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
      {/* Affiche l'icône CaretRight uniquement pour la variante 'tertiary' */}
      {variant === "tertiary" && <CaretRightIcon className="ml-3" />}
    </button>
  );
};

export default Button;
