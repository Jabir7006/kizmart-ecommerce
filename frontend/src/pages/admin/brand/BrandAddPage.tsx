import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useBrand } from "@/hooks/useBrand";
import BrandForm from "@/components/admin/brand/BrandForm";
import type { BrandEditFormOutput } from "@/schemas/brandSchema";

const BrandAddPage = () => {
  const navigate = useNavigate();
  const { createBrandMutation } = useBrand();

  const onSubmit = async (data: BrandEditFormOutput) => {
    try {
      await createBrandMutation.mutateAsync(data);
      toast.success("Brand created successfully!");
      navigate("/admin/brands");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create brand",
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Add New Brand</h1>
      </div>
      <BrandForm
        onSubmit={onSubmit}
        isPending={createBrandMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Brand"
      />
    </div>
  );
};

export default BrandAddPage;
