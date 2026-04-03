import { useEffect, useState } from "react";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import {
  discountSchema,
  type DiscountFormInput,
  type DiscountFormOutput,
} from "@/schemas/discountSchema";
import { getAllProducts } from "@/services/api/product/productApi";
import { useCategory } from "@/hooks/useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormCheckbox } from "@/components/ui/FormCheckbox";
import { FormInput } from "@/components/ui/FormInput";
import { FormSelect } from "@/components/ui/FormSelect";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Product } from "@/types/productType";
import type { Category } from "@/types/categoryType";

const EMPTY_DEFAULTS: DiscountFormInput = {
  name: "",
  discountType: "percentage",
  value: 0,
  targetType: "all",
  targetProducts: [],
  targetCategories: [],
  startDate: "",
  endDate: "",
  isActive: true,
};
const EMPTY_SELECTION: string[] = [];
const EMPTY_PRODUCTS: Product[] = [];

interface DiscountFormProps {
  initialData?: Partial<DiscountFormInput>;
  initialSelectedProducts?: Pick<Product, "_id" | "title">[];
  onSubmit: (data: DiscountFormOutput) => void | Promise<void>;
  isPending?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

const discountTypeOptions = [
  { label: "Percentage", value: "percentage" },
  { label: "Fixed amount", value: "fixed" },
] as const;

const targetTypeOptions = [
  { label: "All products", value: "all" },
  { label: "Specific products", value: "product" },
  { label: "Specific categories", value: "category" },
] as const;

const ProductSelector = ({
  selectedIds,
  selectedProducts,
  availableProducts,
  isLoading,
  searchValue,
  onSearchChange,
  onToggle,
  onRemove,
}: {
  selectedIds: string[];
  selectedProducts: Pick<Product, "_id" | "title">[];
  availableProducts: Pick<Product, "_id" | "title" | "price">[];
  isLoading: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggle: (productId: string) => void;
  onRemove: (productId: string) => void;
}) => {
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

const CategorySelector = ({
  categories,
  selectedIds,
  onToggle,
}: {
  categories: Category[];
  selectedIds: string[];
  onToggle: (categoryId: string) => void;
}) => (
  <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-3">
    {categories.length > 0 ? (
      categories.map((category) => (
        <label
          key={category._id}
          className="flex cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 transition-colors hover:bg-muted/50"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{category.title}</p>
            <p className="text-xs text-muted-foreground">/{category.slug}</p>
          </div>
          <input
            type="checkbox"
            checked={selectedIds.includes(category._id)}
            onChange={() => onToggle(category._id)}
            className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary/20"
          />
        </label>
      ))
    ) : (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No categories available.
      </p>
    )}
  </div>
);

const DiscountForm = ({
  initialData,
  initialSelectedProducts = [],
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = "Save Discount",
}: DiscountFormProps) => {
  const { control, handleSubmit, reset, setValue } = useForm<DiscountFormInput>(
    {
      resolver: zodResolver(discountSchema) as any,
      defaultValues: { ...EMPTY_DEFAULTS, ...initialData },
    },
  );
  const queryClient = useQueryClient();

  const targetType = useWatch({ control, name: "targetType" });
  const watchedProductIds = useWatch({
    control,
    name: "targetProducts",
    defaultValue: EMPTY_SELECTION,
  });
  const watchedCategoryIds = useWatch({
    control,
    name: "targetCategories",
    defaultValue: EMPTY_SELECTION,
  });
  const selectedProductIds = watchedProductIds ?? EMPTY_SELECTION;
  const selectedCategoryIds = watchedCategoryIds ?? EMPTY_SELECTION;

  const [productSearch, setProductSearch] = useState("");
  const debouncedProductSearch = useDebounce(productSearch, 300);

  const { categories, categoriesQuery } = useCategory();

  const productsQuery = useQuery({
    queryKey: ["discount-form-products", debouncedProductSearch],
    queryFn: async () => {
      const response = await getAllProducts({
        search: debouncedProductSearch || undefined,
        status: "active",
        limit: 20,
        page: 1,
      });
      return response.data.data.data as Product[];
    },
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
  useEffect(() => {
    if (initialData) {
      reset({ ...EMPTY_DEFAULTS, ...initialData });
    }
  }, [initialData, reset]);

  useEffect(() => {
    if (targetType === "all") {
      setValue("targetProducts", []);
      setValue("targetCategories", []);
      return;
    }

    if (targetType === "product") {
      setValue("targetCategories", []);
      return;
    }

    if (targetType === "category") {
      setValue("targetProducts", []);
    }
  }, [setValue, targetType]);

  const knownProductsMap = new Map<
    string,
    Pick<Product, "_id" | "title" | "price">
  >();

  initialSelectedProducts.forEach((product) => {
    knownProductsMap.set(product._id, {
      _id: product._id,
      title: product.title,
      price: knownProductsMap.get(product._id)?.price ?? 0,
    });
  });

  queryClient
    .getQueriesData<Product[]>({
      queryKey: ["discount-form-products"],
    })
    .forEach(([, products]) => {
      products?.forEach((product) => {
        knownProductsMap.set(product._id, {
          _id: product._id,
          title: product.title,
          price: product.price,
        });
      });
    });

  const availableProductsMap = new Map<
    string,
    Pick<Product, "_id" | "title" | "price">
  >();

  (productsQuery.data ?? EMPTY_PRODUCTS).forEach((product) => {
    availableProductsMap.set(product._id, {
      _id: product._id,
      title: product.title,
      price: product.price,
    });
  });

  selectedProductIds.forEach((productId) => {
    const selectedProduct = knownProductsMap.get(productId);
    if (selectedProduct && !availableProductsMap.has(productId)) {
      availableProductsMap.set(productId, selectedProduct);
    }
  });

  const availableProducts = Array.from(availableProductsMap.values());

  const selectedProducts: Pick<Product, "_id" | "title">[] = selectedProductIds
    .map((productId) => knownProductsMap.get(productId))
    .filter(
      (
        product,
      ): product is Pick<Product, "_id" | "title" | "price"> => Boolean(product),
    )
    .map((product) => ({ _id: product._id, title: product.title }));

  const toggleArrayValue = (
    fieldName: "targetProducts" | "targetCategories",
    value: string,
    currentValues: string[],
  ) => {
    const nextValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];

    setValue(fieldName, nextValues, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit(values as unknown as DiscountFormOutput),
      )}
      className="mt-6 space-y-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Define the discount type, value, and whether it should be
                active.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormInput
                name="name"
                control={control}
                label="Discount name"
                placeholder="Summer sale"
              />

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormSelect
                  name="discountType"
                  control={control}
                  label="Discount type"
                  options={discountTypeOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                />

                <FormInput
                  name="value"
                  control={control}
                  label="Value"
                  type="number"
                  placeholder="10"
                />
              </div>

              <FormCheckbox
                name="isActive"
                control={control}
                label="Enable this discount immediately"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Targeting</CardTitle>
              <CardDescription>
                Choose whether the discount applies to all products, specific
                products, or categories.
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
                      isLoading={productsQuery.isLoading}
                      searchValue={productSearch}
                      onSearchChange={setProductSearch}
                      onToggle={(productId) =>
                        toggleArrayValue(
                          "targetProducts",
                          productId,
                          selectedProductIds,
                        )
                      }
                      onRemove={(productId) =>
                        toggleArrayValue(
                          "targetProducts",
                          productId,
                          selectedProductIds,
                        )
                      }
                    />
                  )}
                />
              )}

              {targetType === "category" && (
                <Controller
                  name="targetCategories"
                  control={control}
                  render={() =>
                    categoriesQuery.isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <LoadingSpinner className="text-primary" />
                      </div>
                    ) : (
                      <CategorySelector
                        categories={categories}
                        selectedIds={selectedCategoryIds}
                        onToggle={(categoryId) =>
                          toggleArrayValue(
                            "targetCategories",
                            categoryId,
                            selectedCategoryIds,
                          )
                        }
                      />
                    )
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>
                Control when the discount becomes available and when it ends.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <FormInput
                name="startDate"
                control={control}
                label="Start date"
                type="date"
              />
              <FormInput
                name="endDate"
                control={control}
                label="End date"
                type="date"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="min-w-32">
          {isPending ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default DiscountForm;
