import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import useProduct, { useSingleProduct } from "@/hooks/useProduct";
import ProductForm from "@/components/admin/product/ProductForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { ProductEditFormOutput } from "@/schemas/productSchema";

const AdminProductEditPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { updateProductMutation } = useProduct();
  const { data: product, isLoading, isError } = useSingleProduct(slug ?? "");

  const onSubmit = async (data: ProductEditFormOutput) => {
    if (!product?._id) return;
    try {
      await updateProductMutation.mutateAsync({ id: product._id, data });
      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update product",
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-destructive">Product not found.</p>
      </div>
    );
  }

  // Map the loaded product into the form's expected shape
  const initialData = {
    title: product.title,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    price: product.price,
    quantity: product.quantity,
    category: product.category?._id ?? (product.category as any),
    brand: product.brand?._id ?? (product.brand as any) ?? "",
    status: product.status,
    isFeatured: product.isFeatured,
    thumbnail: product.thumbnail as any,
    gallery: (product.gallery ?? []) as any,
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">{product.title}</p>
      </div>
      <ProductForm
        initialData={initialData}
        onSubmit={onSubmit}
        isPending={updateProductMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default AdminProductEditPage;
