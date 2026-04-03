import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { ProductSelectorProps } from "@/components/admin/discount/discount-form/types";

export const ProductSelector = ({
  selectedIds,
  selectedProducts,
  availableProducts,
  isLoading,
  searchValue,
  onSearchChange,
  onToggle,
  onRemove,
}: ProductSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search products</label>
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search active products..."
        />
      </div>

      {selectedProducts.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected products</p>
          <div className="flex flex-wrap gap-2">
            {selectedProducts.map((product) => (
              <Badge
                key={product._id}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                <span className="max-w-48 truncate">{product.title}</span>
                <button
                  type="button"
                  onClick={() => onRemove(product._id)}
                  className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Remove ${product.title}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">Available products</p>
        <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <LoadingSpinner className="text-primary" />
            </div>
          ) : availableProducts.length > 0 ? (
            availableProducts.map((product) => {
              const checked = selectedIds.includes(product._id);

              return (
                <label
                  key={product._id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ৳{product.price.toLocaleString()}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(product._id)}
                    className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary/20"
                  />
                </label>
              );
            })
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No products found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
