import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchProducts } from "@/hooks/useProduct";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import SearchList from "./SearchList";

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
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isFocused, setIsFocused] = useState(false);

  const urlQuery =
    location.pathname === "/store" ? searchParams.get("q") || "" : "";

  const [draft, setDraft] = useState("");

  const displayValue = isFocused ? draft : urlQuery;

  const wrapperRef = useOutsideClick<HTMLDivElement>(() => {
    setIsFocused(false);
    inputRef.current?.blur();
  });

  const debouncedQuery = useDebounce(displayValue, 500);

  const { data: productsData, isLoading } = useSearchProducts(debouncedQuery);
  const products = productsData?.data || [];

  const isOpen = isFocused && displayValue.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDraft(value);
    // If the user clears the input while on the store page, reset the URL too
    if (value === "" && location.pathname === "/store") {
      navigate("/store", { replace: true });
    }
  };

  const handleFocus = () => {
    // Seed the draft so the user continues editing the current URL value
    setDraft(urlQuery);
    setIsFocused(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && displayValue.trim()) {
      e.preventDefault();
      navigate(`/store?q=${encodeURIComponent(displayValue.trim())}`);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleProductSelect = (slug: string) => {
    setIsFocused(false);
    navigate(`/product/${slug}`);
  };

  const handleViewAll = () => {
    setIsFocused(false);
    navigate(`/store?q=${encodeURIComponent(displayValue.trim())}`);
  };

  return (
    <div ref={wrapperRef} className={`relative z-50 w-full ${className}`}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className={`pl-9 pr-4 w-full rounded-full bg-muted border-border focus:ring-2 focus:ring-primary/30 transition-all ${inputClassName}`}
        />
      </div>

      {isOpen && (
        <SearchList
          products={products}
          isLoading={isLoading}
          onSelectProduct={handleProductSelect}
          onViewAll={handleViewAll}
        />
      )}
    </div>
  );
};

export default SearchBar;
