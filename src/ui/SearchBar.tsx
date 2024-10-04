import SearchIcon from "@/assets/images/icon-search.svg";

/**
 * Props pour le composant SearchBar.
 * @property {function} setSearchQuery - Fonction de rappel pour mettre à jour la requête de recherche saisie.
 * @property {string} [placeholderText] - Texte du placeholder pour le champ de recherche. Par défaut: "Search...".
 */
interface SearchBarProps {
  setSearchQuery: (query: string) => void;
  placeholderText?: string;
}

// Style du placeholder
const placeholderStyle = {
  fontSize: "0.875rem",
  letterSpacing: "0px",
  lineHeight: "150%",
};

/**
 * Composant SearchBar pour permettre à l'utilisateur de saisir une requête de recherche.
 *
 * Ce composant est conçu avec une icône de recherche et un champ de saisie. La requête de recherche
 * est mise à jour via la fonction `setSearchQuery` passée en prop.
 *
 * @param {SearchBarProps} props - Les props nécessaires pour configurer la SearchBar.
 * @returns JSX.Element
 */
export default function SearchBar({
  setSearchQuery,
  placeholderText = "Search...",
}: SearchBarProps) {
  return (
    <div className="w-full md:min-w-[162px] lg:max-w-[320px] relative flex bg-white rounded-lg">
      {/* Champ de saisie pour la recherche */}
      <input
        type="text"
        name="search"
        placeholder={placeholderText}
        aria-label="Search field"
        className={`block w-full rounded-md border-0 py-3.5 px-5 pr-10 md:pr-10 sm:pr-10 text-grey-900 ring-1 ring-inset ring-grey-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-900 sm:text-preset-5`}
        style={placeholderStyle}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Icône de recherche à droite */}
      <div className="absolute inset-y-0 right-5 flex items-center">
        <SearchIcon aria-hidden="true" />
      </div>
    </div>
  );
}
