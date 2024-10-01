import React from "react";
import Button from "@/ui/Button";

/**
 * Props pour le composant HeaderPage.
 * @property {string} title - Le titre à afficher dans l'en-tête.
 * @property {boolean} [showButton] - Indique si un bouton doit être affiché dans l'en-tête. Par défaut: false.
 * @property {string} [buttonText] - Le texte à afficher dans le bouton, si showButton est activé.
 * @property {function} [onButtonClick] - Fonction de rappel pour gérer le clic sur le bouton.
 */
interface HeaderPageProps {
  title: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

/**
 * Composant HeaderPage pour afficher un en-tête avec un titre et, de manière optionnelle, un bouton.
 *
 * Le bouton n'est affiché que si la prop `showButton` est passée à true.
 * Le texte du bouton et l'action à effectuer lors du clic sont configurés via les props `buttonText` et `onButtonClick`.
 *
 * @param {HeaderPageProps} props - Les props nécessaires pour configurer le HeaderPage.
 * @returns JSX.Element
 */
const HeaderPage: React.FC<HeaderPageProps> = ({
  title,
  showButton = false,
  buttonText,
  onButtonClick,
}) => {
  return (
    <header className="self-stretch h-14 flex justify-between items-center gap-6">
      {/* Titre de la page */}
      <h1 className="text-grey-900 text-preset-1 font-bold">{title}</h1>

      {/* Bouton conditionnel */}
      {showButton && (
        <Button type="button" variant={"primary"} onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </header>
  );
};

export default HeaderPage;
