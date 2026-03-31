import { Loader2 } from "lucide-react";
import { getImageUrl } from "@/lib/getImageUrl";
import type { PaginatedProducts } from "@/types/productType";

interface SearchListProps {
  products: PaginatedProducts["data"];
  isLoading: boolean;
  onSelectProduct: (slug: string) => void;
  onViewAll: () => void;
}

const SearchList = ({
  products,
  isLoading,
  onSelectProduct,
  onViewAll,
}: SearchListProps) => {
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-md border shadow-md overflow-hidden animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {!isLoading && products.length === 0 && (
        <div className="p-4 text-sm text-center text-muted-foreground">
          No products found
        </div>
      )}
      {!isLoading && products.length > 0 && (
        <ul className="max-h-80 overflow-y-auto w-full">
          {products.map((product) => (
            <li
              key={product._id}
              onClick={() => onSelectProduct(product.slug)}
              className="flex items-center gap-3 p-2 hover:bg-muted cursor-pointer transition-colors"
            >
              <img
                src={getImageUrl(product.thumbnail, "thumbnail")}
                alt={product.title}
                className="h-10 w-10 object-cover rounded shrink-0 border"
              />
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">{product.title}</p>
                <p className="text-xs text-muted-foreground">
                  ৳{product.price.toLocaleString("en-BD")}
                </p>
              </div>
            </li>
          ))}
          <li
            onClick={onViewAll}
            className="p-3 text-sm font-medium text-center text-primary bg-muted/50 hover:bg-muted cursor-pointer transition-colors border-t"
          >
            View all results
          </li>
        </ul>
      )}
    </div>
  );
};

export default SearchList;
