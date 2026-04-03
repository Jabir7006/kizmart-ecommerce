import { Controller } from "react-hook-form";

import { CategorySelector } from "@/components/admin/discount/discount-form/CategorySelector";
import { ProductSelector } from "@/components/admin/discount/discount-form/ProductSelector";
import { targetTypeOptions } from "@/components/admin/discount/discount-form/constants";
import type { DiscountFormSectionProps } from "@/components/admin/discount/discount-form/types";
import { FormSelect } from "@/components/ui/FormSelect";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types/categoryType";
import type { Product } from "@/types/productType";

interface TargetingCardProps extends DiscountFormSectionProps {
  targetType: "product" | "category" | "all";
  selectedProductIds: string[];
  selectedCategoryIds: string[];
  selectedProducts: Pick<Product, "_id" | "title">[];
  availableProducts: Pick<Product, "_id" | "title" | "price">[];
  isProductsLoading: boolean;
  productSearch: string;
  onProductSearchChange: (value: string) => void;
  onToggleProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
  categories: Category[];
  isCategoriesLoading: boolean;
  onToggleCategory: (categoryId: string) => void;
}

export const TargetingCard = ({
  control,
  targetType,
  selectedProductIds,
  selectedCategoryIds,
  selectedProducts,
  availableProducts,
  isProductsLoading,
  productSearch,
  onProductSearchChange,
  onToggleProduct,
  onRemoveProduct,
  categories,
  isCategoriesLoading,
  onToggleCategory,
}: TargetingCardProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Targeting</CardTitle>
      <CardDescription>
        Choose whether the discount applies to all products, specific products,
        or categories.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-5">
      <FormSelect
        name="targetType"
        control={control}
        label="Target type"
        options={targetTypeOptions.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
      />

      {targetType === "all" && (
        <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
          This discount will apply to every eligible product.
        </div>
      )}

      {targetType === "product" && (
        <Controller
          name="targetProducts"
          control={control}
          render={() => (
            <ProductSelector
              selectedIds={selectedProductIds}
              selectedProducts={selectedProducts}
              availableProducts={availableProducts}
              isLoading={isProductsLoading}
              searchValue={productSearch}
              onSearchChange={onProductSearchChange}
              onToggle={onToggleProduct}
              onRemove={onRemoveProduct}
            />
          )}
        />
      )}

      {targetType === "category" && (
        <Controller
          name="targetCategories"
          control={control}
          render={() =>
            isCategoriesLoading ? (
              <div className="flex items-center justify-center py-6">
                <LoadingSpinner className="text-primary" />
              </div>
            ) : (
              <CategorySelector
                categories={categories}
                selectedIds={selectedCategoryIds}
                onToggle={onToggleCategory}
              />
            )
          }
        />
      )}
    </CardContent>
  </Card>
);
