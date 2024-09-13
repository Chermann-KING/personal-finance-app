import InputField from "./InputField";
import SearchIcon from "@/assets/images/icon-search.svg";

interface SearchBarProps {
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ setSearchQuery }: SearchBarProps) {
  return (
    <InputField
      type="text"
      placeholder="Search transaction"
      onChange={(e) => setSearchQuery(e.target.value)}
      name={"searchBar"}
      icon={<SearchIcon />}
    />
  );
}
