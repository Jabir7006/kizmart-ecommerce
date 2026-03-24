import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useCategory, useSingleCategory } from "@/hooks/useCategory";
import CategoryForm from "@/components/admin/category/CategoryForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { CategoryEditFormOutput } from "@/schemas/categorySchema";

const CategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateCategoryMutation } = useCategory();
  const { data: category, isLoading, isError } = useSingleCategory(id ?? "");

  const onSubmit = async (data: CategoryEditFormOutput) => {
    if (!category?._id) return;
    try {
      await updateCategoryMutation.mutateAsync({ id: category._id, data });
      toast.success("Category updated successfully!");
      navigate("/admin/categories");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update category",
      );
    }
  };

  // Memoize so the object reference only changes when the actual category data changes.
  // Without this, a new object is created on every render, causing CategoryForm's
  // useEffect to call reset() and restore the thumbnail after the user removes it.
  // Must be before early returns to comply with React's Rules of Hooks.
  const initialData = useMemo(
    () => ({
      title: category?.title ?? "",
      thumbnail: (category?.thumbnail ?? undefined) as any,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category?._id, category?.title, category?.thumbnail],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-destructive">Category not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-sm text-muted-foreground mt-1">{category.title}</p>
      </div>
      <CategoryForm
        key={category._id}
        initialData={initialData}
        onSubmit={onSubmit}
        isPending={updateCategoryMutation.isPending}
        onCancel={() => navigate(-1)}
        submitLabel="Save Changes"
      />
    </div>
  );
};

export default CategoryEditPage;
