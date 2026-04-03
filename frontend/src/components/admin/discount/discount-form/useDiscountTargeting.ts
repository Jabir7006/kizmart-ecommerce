import { useEffect, useState } from "react";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";

import { EMPTY_SELECTION } from "@/components/admin/discount/discount-form/constants";
import type {
  DiscountSelectableProduct,
  DiscountSelectedProduct,
} from "@/components/admin/discount/discount-form/types";
import { useCategory } from "@/hooks/useCategory";
import { useDebounce } from "@/hooks/useDebounce";
import type { DiscountFormInput } from "@/schemas/discountSchema";
import { getAllProducts } from "@/services/api/product/productApi";
import type { Product } from "@/types/productType";

interface UseDiscountTargetingOptions {
  control: Control<DiscountFormInput>;
  setValue: UseFormSetValue<DiscountFormInput>;
  initialSelectedProducts?: DiscountSelectedProduct[];
}

export const useDiscountTargeting = ({
  control,
  setValue,
  initialSelectedProducts = [],
}: UseDiscountTargetingOptions) => {
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

  const knownProductsMap = new Map<string, DiscountSelectableProduct>();

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

  const availableProductsMap = new Map<string, DiscountSelectableProduct>();

  (productsQuery.data ?? []).forEach((product) => {
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
  const selectedProducts: DiscountSelectedProduct[] = selectedProductIds
    .map((productId) => knownProductsMap.get(productId))
    .filter(
      (
        product,
      ): product is DiscountSelectableProduct => Boolean(product),
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

  return {
    availableProducts,
    categories,
    categoriesQuery,
    productSearch,
    productsQuery,
    selectedCategoryIds,
    selectedProductIds,
    selectedProducts,
    setProductSearch,
    targetType,
    toggleArrayValue,
  };
};
