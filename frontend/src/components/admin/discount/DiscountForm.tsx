import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  EMPTY_DEFAULTS,
} from "@/components/admin/discount/discount-form/constants";
import { GeneralInfoCard } from "@/components/admin/discount/discount-form/GeneralInfoCard";
import { ScheduleCard } from "@/components/admin/discount/discount-form/ScheduleCard";
import { TargetingCard } from "@/components/admin/discount/discount-form/TargetingCard";
import { useDiscountTargeting } from "@/components/admin/discount/discount-form/useDiscountTargeting";
import { Button } from "@/components/ui/button";
import {
  discountSchema,
  type DiscountFormInput,
  type DiscountFormOutput,
} from "@/schemas/discountSchema";
import type { Product } from "@/types/productType";

interface DiscountFormProps {
  initialData?: Partial<DiscountFormInput>;
  initialSelectedProducts?: Pick<Product, "_id" | "title">[];
  onSubmit: (data: DiscountFormOutput) => void | Promise<void>;
  isPending?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

const DiscountForm = ({
  initialData,
  initialSelectedProducts = [],
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = "Save Discount",
}: DiscountFormProps) => {
  const { control, handleSubmit, reset, setValue } = useForm<
    DiscountFormInput
  >({
    resolver: zodResolver(discountSchema) as any,
    defaultValues: { ...EMPTY_DEFAULTS, ...initialData },
  });

  const {
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
  } = useDiscountTargeting({
    control,
    setValue,
    initialSelectedProducts,
  });

  useEffect(() => {
    if (initialData) {
      reset({ ...EMPTY_DEFAULTS, ...initialData });
    }
  }, [initialData, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit(values as unknown as DiscountFormOutput),
      )}
      className="mt-6 space-y-8"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GeneralInfoCard control={control} />
          <TargetingCard
            control={control}
            targetType={targetType}
            selectedProductIds={selectedProductIds}
            selectedCategoryIds={selectedCategoryIds}
            selectedProducts={selectedProducts}
            availableProducts={availableProducts}
            isProductsLoading={productsQuery.isLoading}
            productSearch={productSearch}
            onProductSearchChange={setProductSearch}
            onToggleProduct={(productId) =>
              toggleArrayValue("targetProducts", productId, selectedProductIds)
            }
            onRemoveProduct={(productId) =>
              toggleArrayValue("targetProducts", productId, selectedProductIds)
            }
            categories={categories}
            isCategoriesLoading={categoriesQuery.isLoading}
            onToggleCategory={(categoryId) =>
              toggleArrayValue(
                "targetCategories",
                categoryId,
                selectedCategoryIds,
              )
            }
          />
        </div>

        <div className="space-y-6">
          <ScheduleCard control={control} />
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
