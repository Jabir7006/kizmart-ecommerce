import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  productSchema,
  type ProductFormInput,
  type ProductFormOutput,
} from "@/schemas/productSchema";
import useProduct from "@/hooks/useProduct";

import { Button } from "@/components/ui/button";
import { GeneralInfoCard } from "@/components/admin/product/product-form/GeneralInfoCard";
import { PricingCard } from "@/components/admin/product/product-form/PricingCard";
import { MediaCard } from "@/components/admin/product/product-form/MediaCard";
import { SidebarCards } from "@/components/admin/product/product-form/SidebarCards";

const AdminProductAddPage = () => {
  const navigate = useNavigate();
  const { createProductMutation } = useProduct();

  const { control, handleSubmit } = useForm<
    ProductFormInput,
    any,
    ProductFormOutput
  >({
    resolver: zodResolver(productSchema),
    defaultValues: {
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
      thumbnail: undefined,
    },
  });

  const onSubmit = async (data: ProductFormOutput) => {
    try {
      await createProductMutation.mutateAsync(data);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error: any) {
      console.error("Failed to create product", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product",
      );
    }
  };

  const isPending = createProductMutation.isPending;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <GeneralInfoCard control={control} />
            <PricingCard control={control} />
            <MediaCard control={control} />
          </div>

          {/* Sidebar */}
          <SidebarCards control={control} />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-32">
            {isPending ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductAddPage;
