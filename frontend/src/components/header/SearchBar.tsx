import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  inputClassName?: string;
}

const SearchBar = ({
  className = "",
  placeholder = "Search products…",
  inputClassName = "",
}: SearchBarProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className={`pl-9 pr-4 w-full rounded-full bg-muted border-border focus:ring-2 focus:ring-primary/30 transition-all ${inputClassName}`}
      />
    </div>
  );
};

export default SearchBar;
