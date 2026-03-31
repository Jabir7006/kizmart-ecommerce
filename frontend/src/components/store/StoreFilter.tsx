import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import FilterPanelBody from "./FilterPanelBody";
import type { ProductFilters } from "@/types/productType";
import type { Category } from "@/types/categoryType";
import type { Brand } from "@/types/brandType";
import { SlidersHorizontal, X } from "lucide-react";

interface StoreFilterProps {
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  categories: Category[];
  brands: Brand[];
  totalProducts: number;
  onClear: () => void;
}

function countActiveFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.categorySlug) count++;
  if (filters.brandSlug) count++;
  if (filters.minPrice != null) count++;
  if (filters.maxPrice != null) count++;
  if (
    filters.sortBy &&
    filters.sortOrder &&
    !(filters.sortBy === "createdAt" && filters.sortOrder === "desc")
  )
    count++;
  return count;
}

const StoreFilter = ({
  filters,
  setFilters,
  categories,
  brands,
  totalProducts,
  onClear,
}: StoreFilterProps) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? "");
  const [prevFilters, setPrevFilters] = useState({
    min: filters.minPrice,
    max: filters.maxPrice,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync local price inputs when filters reset externally (e.g. "Clear All")
  if (
    filters.minPrice !== prevFilters.min ||
    filters.maxPrice !== prevFilters.max
  ) {
    setPrevFilters({ min: filters.minPrice, max: filters.maxPrice });
    setMinPrice(filters.minPrice?.toString() ?? "");
    setMaxPrice(filters.maxPrice?.toString() ?? "");
  }

  const handleApplyPrice = () =>
    setFilters({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });

  const handleClear = () => {
    onClear();
    setMobileOpen(false);
  };

  const activeCount = countActiveFilters(filters);

  const panelProps = {
    filters,
    setFilters,
    categories,
    brands,
    minPrice,
    maxPrice,
    onMinPriceChange: setMinPrice,
    onMaxPriceChange: setMaxPrice,
    onApplyPrice: handleApplyPrice,
  };

  const productLabel = `${totalProducts} product${totalProducts !== 1 ? "s" : ""}`;

  // ─── Desktop sidebar ───────────────────────────────────────────────────────
  return (
    <>
      <aside className="hidden md:block w-64 shrink-0 self-start sticky top-24">
        <div className="rounded-xl border border-border bg-card shadow-sm p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <h2 className="font-semibold text-base">Filters</h2>
              {activeCount > 0 && (
                <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                  {activeCount}
                </Badge>
              )}
            </div>
            {activeCount > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="size-3" />
                Clear
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground -mt-2">{productLabel}</p>

          <div className="border-t border-border/60" />

          <FilterPanelBody {...panelProps} />
        </div>
      </aside>

      {/* ─── Mobile trigger + Sheet ────────────────────────────────────────── */}
      <div className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <Badge className="h-4 min-w-4 rounded-full px-1 text-[10px] leading-none">
              {activeCount}
            </Badge>
          )}
        </Button>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-80 p-0 flex flex-col">
            <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/60">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="size-4 text-primary" />
                Filters
                {activeCount > 0 && (
                  <Badge className="h-5 min-w-5 rounded-full px-1.5 text-[10px]">
                    {activeCount}
                  </Badge>
                )}
              </SheetTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {productLabel}
              </p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterPanelBody {...panelProps} />
            </div>

            <SheetFooter className="px-5 py-4 border-t border-border/60 flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="flex-1"
                disabled={activeCount === 0}
              >
                <X className="size-3.5 mr-1" />
                Clear All
              </Button>
              <Button
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="flex-1"
              >
                Show Results
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default StoreFilter;
