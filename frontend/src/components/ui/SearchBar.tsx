import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  onClear?: () => void;
  className?: string;
  inputClassName?: string;
  maxWidth?: string;
}

const SearchBar = ({
  value = "",
  placeholder = "Search…",
  onSearch,
  onClear,
  className,
  inputClassName,
  maxWidth = "max-w-sm",
}: SearchBarProps) => {
  const [draft, setDraft] = useState(value);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSearch(draft.trim());
  };

  const handleClear = () => {
    setDraft("");
    onSearch("");
    onClear?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex items-center gap-2", className)}
      role="search"
    >
      <div className={cn("relative flex-1", maxWidth)}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={draft}
          onChange={handleChange}
          className={cn("pl-9", draft && "pr-8", inputClassName)}
          aria-label={placeholder}
        />
        {draft && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <Button type="submit" variant="secondary" size="sm">
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
