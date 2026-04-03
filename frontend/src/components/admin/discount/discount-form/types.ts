import type { Control } from "react-hook-form";

import type { DiscountFormInput } from "@/schemas/discountSchema";
import type { Category } from "@/types/categoryType";
import type { Product } from "@/types/productType";

export interface DiscountFormSectionProps {
  control: Control<DiscountFormInput>;
}

export type DiscountSelectedProduct = Pick<Product, "_id" | "title">;
export type DiscountSelectableProduct = Pick<Product, "_id" | "title" | "price">;

export interface ProductSelectorProps {
  selectedIds: string[];
  selectedProducts: DiscountSelectedProduct[];
  availableProducts: DiscountSelectableProduct[];
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggle: (productId: string) => void;
  onRemove: (productId: string) => void;
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedIds: string[];
  onToggle: (categoryId: string) => void;
}
