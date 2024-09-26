import SearchIcon from "@/assets/images/icon-search.svg";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
  placeholderText?: string;
}

// affichage
const placeholderStyle = {
  fontSize: "0.875rem",
  letterSpacing: "0px",
  lineHeight: "150%",
};

export default function SearchBar({
  setSearchQuery,
  placeholderText = "Search...",
}: SearchBarProps) {
  return (
    <div className="w-[215px] md:w-[320px] sm:w-[162px] relative flex bg-white rounded-lg">
      {/* Champ input */}
      <input
        type="text"
        name="search"
        placeholder={placeholderText}
        className={`block w-full min-w-[215px] rounded-md border-0 py-3.5 px-5 pr-10 md:pr-10 sm:pr-10 text-grey-900 ring-1 ring-inset ring-grey-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-black sm:text-preset-5`}
        style={placeholderStyle}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Icône */}
      <div className="absolute inset-y-0 right-5 flex items-center">
        <SearchIcon />
      </div>
    </div>
  );
}
