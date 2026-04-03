import { useNavigate } from "react-router-dom";

import DiscountForm from "@/components/admin/discount/DiscountForm";
import { useDiscount } from "@/hooks/useDiscount";
import type { DiscountFormOutput } from "@/schemas/discountSchema";

const DiscountAddPage = () => {
  const navigate = useNavigate();
  const { createDiscountMutation } = useDiscount();

  const onSubmit = async (data: DiscountFormOutput) => {
    try {
      await createDiscountMutation.mutateAsync(data);
      navigate("/admin/discounts");
    } catch {
      // Error handled by hook
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Add New Discount</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a promotion for all products, selected products, or entire
          categories.
        </p>
      </div>

      <DiscountForm
        onSubmit={onSubmit}
        isPending={createDiscountMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Discount"
      />
    </div>
  );
};

export default DiscountAddPage;
