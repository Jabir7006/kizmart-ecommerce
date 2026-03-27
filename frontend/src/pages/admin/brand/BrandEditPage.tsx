import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useBrand, useSingleBrand } from "@/hooks/useBrand";
import BrandForm from "@/components/admin/brand/BrandForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { BrandEditFormOutput } from "@/schemas/brandSchema";

const BrandEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateBrandMutation } = useBrand();
  const { data: brand, isLoading, isError } = useSingleBrand(id ?? "");

  const onSubmit = async (data: BrandEditFormOutput) => {
    if (!brand?._id) return;
    try {
      await updateBrandMutation.mutateAsync({ id: brand._id, data });
      toast.success("Brand updated successfully!");
      navigate("/admin/brands");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update brand",
      );
    }
  };

  const initialData = useMemo(
    () => ({
      title: brand?.title ?? "",
      logo: (brand?.logo ?? undefined) as any,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [brand?._id, brand?.title, brand?.logo],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  if (isError || !brand) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-destructive">Brand not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Edit Brand</h1>
        <p className="text-sm text-muted-foreground mt-1">{brand.title}</p>
      </div>
      <BrandForm
        key={brand._id}
        initialData={initialData}
        onSubmit={onSubmit}
        isPending={updateBrandMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default BrandEditPage;
