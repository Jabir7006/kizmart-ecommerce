import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { ProductFilters } from "@/types/productType";
import type { Category } from "@/types/categoryType";
import type { Brand } from "@/types/brandType";

interface StoreFilterProps {
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  categories: Category[];
  brands: Brand[];
  totalProducts: number;
  onClear: () => void;
}

const StoreFilter = ({
  filters,
  setFilters,
  categories,
  brands,
  totalProducts,
  onClear,
}: StoreFilterProps) => {
  const [minPrice, setMinPrice] = useState<string>(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState<string>(filters.maxPrice?.toString() || "");
  const [prevFilters, setPrevFilters] = useState({
    min: filters.minPrice,
    max: filters.maxPrice,
  });

  // Track prop changes directly during render (React-recommended pattern)
  if (filters.minPrice !== prevFilters.min || filters.maxPrice !== prevFilters.max) {
    setPrevFilters({ min: filters.minPrice, max: filters.maxPrice });
    setMinPrice(filters.minPrice?.toString() || "");
    setMaxPrice(filters.maxPrice?.toString() || "");
  }

  const handleApplyPrice = () => {
    setFilters({
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };
  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Filters</h2>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">{totalProducts} Products</span>
          <button 
            onClick={onClear}
            className="text-sm text-primary hover:underline"
          >
            Clear
          </button>
        </div>

        <div className="space-y-6">
          {/* Sort */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <select
              value={filters.sortBy && filters.sortOrder ? `${filters.sortBy}-${filters.sortOrder}` : "createdAt-desc"}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                setFilters({ sortBy, sortOrder: sortOrder as "asc" | "desc" });
              }}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title-asc">Name: A to Z</option>
            </select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              value={filters.categorySlug || "all"}
              onChange={(e) => setFilters({ categorySlug: e.target.value === "all" ? undefined : e.target.value })}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
          {brands && brands.length > 0 && (
            <div className="space-y-2">
              <Label>Brand</Label>
              <select
                value={filters.brandSlug || "all"}
                onChange={(e) => setFilters({ brandSlug: e.target.value === "all" ? undefined : e.target.value })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b._id} value={b.slug}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Price Range */}
          <div className="space-y-2">
            <Label>Price Range (৳)</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleApplyPrice}
                className="w-full"
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default StoreFilter;
