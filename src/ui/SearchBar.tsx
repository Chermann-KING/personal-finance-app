import InputField from "./InputField";
import SearchIcon from "@/assets/images/icon-search.svg";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
  placeholderText?: string;
}

export default function SearchBar({
  setSearchQuery,
  placeholderText = "Search...",
}: SearchBarProps) {
  return (
    <InputField
      type="text"
      placeholder={placeholderText}
      onChange={(e) => setSearchQuery(e.target.value)}
      name={"searchBar"}
      icon={<SearchIcon />}
    />
  );
}
