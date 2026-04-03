import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DiscountForm from "@/components/admin/discount/DiscountForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDiscount, useSingleDiscount } from "@/hooks/useDiscount";
import type { DiscountFormInput, DiscountFormOutput } from "@/schemas/discountSchema";

const DiscountEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateDiscountMutation } = useDiscount();
  const { data: discount, isLoading, isError } = useSingleDiscount(id ?? "");

  const onSubmit = async (data: DiscountFormOutput) => {
    if (!discount?._id) return;

    try {
      await updateDiscountMutation.mutateAsync({ id: discount._id, data });
      navigate("/admin/discounts");
    } catch {
      // Error handled by hook
    }
  };

  const initialData = useMemo<Partial<DiscountFormInput> | undefined>(
    () =>
      discount
        ? {
            name: discount.name,
            discountType: discount.discountType,
            value: discount.value,
            targetType: discount.targetType,
            targetProducts: discount.targetProducts.map((product) => product._id),
            targetCategories: discount.targetCategories.map(
              (category) => category._id,
            ),
            startDate: new Date(discount.startDate).toISOString().split("T")[0],
            endDate: new Date(discount.endDate).toISOString().split("T")[0],
            isActive: discount.isActive,
          }
        : undefined,
    [discount],
  );

  const initialSelectedProducts = useMemo(
    () =>
      discount?.targetProducts.map((product) => ({
        _id: product._id,
        title: product.title,
      })) ?? [],
    [discount?.targetProducts],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  if (isError || !discount) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-destructive">Discount not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Edit Discount</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {discount.name}
        </p>
      </div>

      <DiscountForm
        key={discount._id}
        initialData={initialData}
        initialSelectedProducts={initialSelectedProducts}
        onSubmit={onSubmit}
        isPending={updateDiscountMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default DiscountEditPage;
