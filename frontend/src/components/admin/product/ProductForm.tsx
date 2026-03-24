import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  editProductSchema,
  type ProductEditFormInput,
  type ProductEditFormOutput,
} from "@/schemas/productSchema";

import { Button } from "@/components/ui/button";
import { GeneralInfoCard } from "@/components/admin/product/product-form/GeneralInfoCard";
import { PricingCard } from "@/components/admin/product/product-form/PricingCard";
import { MediaCard } from "@/components/admin/product/product-form/MediaCard";
import { SidebarCards } from "@/components/admin/product/product-form/SidebarCards";

const EMPTY_DEFAULTS: ProductEditFormInput = {
  title: "",
  shortDescription: "",
  longDescription: "",
  price: 0,
  quantity: 0,
  category: "",
  brand: "",
  status: "draft",
  isFeatured: false,
  gallery: [],
  thumbnail: undefined as any,
};

interface ProductFormProps {
  /** Pre-populated values for edit mode. Omit for create mode. */
  initialData?: Partial<ProductEditFormInput>;
  onSubmit: (data: ProductEditFormOutput) => void | Promise<void>;
  isPending?: boolean;
  onCancel: () => void;
  submitLabel?: string;
}

/**
 * Shared form used by both AdminProductAddPage and AdminProductEditPage.
 * Accepts initialData to pre-fill fields in edit mode.
 */
const ProductForm = ({
  initialData,
  onSubmit,
  isPending = false,
  onCancel,
  submitLabel = "Save Product",
}: ProductFormProps) => {
  const { control, handleSubmit, reset } = useForm<
    ProductEditFormInput,
    any,
    ProductEditFormOutput
  >({
    resolver: zodResolver(editProductSchema),
    defaultValues: { ...EMPTY_DEFAULTS, ...initialData },
  });

  // Re-populate when initialData arrives asynchronously (edit mode)
  useEffect(() => {
    if (initialData) {
      reset({ ...EMPTY_DEFAULTS, ...initialData });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GeneralInfoCard control={control} />
          <PricingCard control={control} />
          <MediaCard control={control} />
        </div>
        <SidebarCards control={control} />
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

export default ProductForm;
