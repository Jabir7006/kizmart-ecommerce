import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import useProduct from "@/hooks/useProduct";
import ProductForm from "@/components/admin/product/ProductForm";
import type { ProductEditFormOutput } from "@/schemas/productSchema";

const AdminProductAddPage = () => {
  const navigate = useNavigate();
  const { createProductMutation } = useProduct();

  const onSubmit = async (data: ProductEditFormOutput) => {
    try {
      await createProductMutation.mutateAsync(data);
      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create product",
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>
      <ProductForm
        onSubmit={onSubmit}
        isPending={createProductMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Product"
      />
    </div>
  );
};

export default AdminProductAddPage;
