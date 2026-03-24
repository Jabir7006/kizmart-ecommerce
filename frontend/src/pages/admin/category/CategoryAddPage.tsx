import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useCategory } from "@/hooks/useCategory";
import CategoryForm from "@/components/admin/category/CategoryForm";
import type { CategoryEditFormOutput } from "@/schemas/categorySchema";

const CategoryAddPage = () => {
  const navigate = useNavigate();
  const { createCategoryMutation } = useCategory();

  const onSubmit = async (data: CategoryEditFormOutput) => {
    try {
      await createCategoryMutation.mutateAsync(data);
      toast.success("Category created successfully!");
      navigate("/admin/categories");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create category",
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Add New Category</h1>
      </div>
      <CategoryForm
        onSubmit={onSubmit}
        isPending={createCategoryMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Category"
      />
    </div>
  );
};

export default CategoryAddPage;
