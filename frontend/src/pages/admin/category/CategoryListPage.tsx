import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";
import { AdminListTemplate } from "@/components/ui/AdminListTemplate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminCategoryListItem from "@/components/admin/category/AdminCategoryListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import { Button } from "@/components/ui/button";
import { useCategory } from "@/hooks/useCategory";
import type { Category } from "@/types/categoryType";

const CategoryListPage = () => {
  const { categories, categoriesQuery, deleteCategoryMutation } = useCategory();
  const { isLoading, isError, error, refetch } = categoriesQuery;

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Handlers ── */
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete._id);
    } catch {
      // Error handled by the hook
    } finally {
      setCategoryToDelete(null);
    }
  };

  // Client-side filtering as categories are likely fully loaded
  const filteredCategories = categories.filter((cat: Category) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ── Empty state helpers ── */
  const emptyTitle = searchQuery
    ? `No results for "${searchQuery}"`
    : "No categories found";

  const emptyDescription = searchQuery
    ? "Try a different search term."
    : "Add your first category to get started.";

  return (
    <AdminListTemplate
      title="Categories"
      description="Manage your store's categories"
      headerAction={
        <Button asChild size="sm">
          <Link to="/admin/categories/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Category
          </Link>
        </Button>
      }
      searchValue={searchQuery}
      onSearch={handleSearch}
      searchPlaceholder="Search categories…"
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      onRetry={() => refetch()}
      isEmpty={filteredCategories.length === 0}
      emptyIcon={<LayoutGrid className="h-8 w-8 text-muted-foreground/50" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={
        !searchQuery ? (
          <Button asChild size="sm">
            <Link to="/admin/categories/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        ) : undefined
      }
      items={filteredCategories}
      renderItem={(category: Category) => (
        <AdminCategoryListItem
          key={category._id}
          category={category}
          onDelete={handleDelete}
        />
      )}
      renderSkeleton={() => (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <ListItemSkeleton key={i} showImage descriptionLines={1} />
          ))}
        </>
      )}
    >
      <ConfirmModal
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </AdminListTemplate>
  );
};

export default CategoryListPage;
