import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ProductFilters } from "@/types/productType";
import type { Category } from "@/types/categoryType";
import type { Brand } from "@/types/brandType";
import { ArrowUpDown, CircleDollarSign, Layers, Tag } from "lucide-react";

const selectClass =
  "w-full h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:border-ring/60 cursor-pointer";

interface FilterPanelBodyProps {
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  categories: Category[];
  brands: Brand[];
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onApplyPrice: () => void;
}

const FilterPanelBody = ({
  filters,
  setFilters,
  categories,
  brands,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApplyPrice,
}: FilterPanelBodyProps) => {
  return (
    <div className="space-y-5">
      {/* Sort */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ArrowUpDown className="size-3.5" />
          Sort By
        </Label>
        <select
          value={
            filters.sortBy && filters.sortOrder
              ? `${filters.sortBy}-${filters.sortOrder}`
              : "createdAt-desc"
          }
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-");
            setFilters({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
          }}
          className={selectClass}
        >
          <option value="createdAt-desc">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="title-asc">Name: A to Z</option>
        </select>
      </div>

      <div className="border-t border-border/60" />

      {/* Category */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Layers className="size-3.5" />
          Category
        </Label>
        <select
          value={filters.categorySlug || "all"}
          onChange={(e) =>
            setFilters({
              categorySlug:
                e.target.value === "all" ? undefined : e.target.value,
            })
          }
          className={selectClass}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug!}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <>
          <div className="border-t border-border/60" />
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Tag className="size-3.5" />
              Brand
            </Label>
            <select
              value={filters.brandSlug || "all"}
              onChange={(e) =>
                setFilters({
                  brandSlug:
                    e.target.value === "all" ? undefined : e.target.value,
                })
              }
              className={selectClass}
            >
              <option value="all">All Brands</option>
              {brands.map((b) => (
                <option key={b._id} value={b.slug}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="border-t border-border/60" />

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <CircleDollarSign className="size-3.5" />
          Price Range (৳)
        </Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            className="w-full"
          />
          <span className="shrink-0 text-xs text-muted-foreground font-medium">
            to
          </span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onApplyPrice}
          className="w-full mt-1"
        >
          Apply Price
        </Button>
      </div>
    </div>
  );
};

export default FilterPanelBody;
