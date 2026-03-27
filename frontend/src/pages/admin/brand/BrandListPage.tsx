import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Plus } from "lucide-react";
import { AdminListTemplate } from "@/components/ui/AdminListTemplate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminBrandListItem from "@/components/admin/brand/AdminBrandListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/hooks/useBrand";
import type { Brand } from "@/types/brandType";

const BrandListPage = () => {
  const { brands, brandsQuery, deleteBrandMutation } = useBrand();
  const { isLoading, isError, error, refetch } = brandsQuery;

  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Handlers ── */
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handleDelete = (brand: Brand) => {
    setBrandToDelete(brand);
  };

  const handleConfirmDelete = async () => {
    if (!brandToDelete) return;
    try {
      await deleteBrandMutation.mutateAsync(brandToDelete._id);
    } catch {
      // Error handled by the hook
    } finally {
      setBrandToDelete(null);
    }
  };

  // Client-side filtering as brands are likely fully loaded
  const filteredBrands = brands.filter((brand: Brand) =>
    brand.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  /* ── Empty state helpers ── */
  const emptyTitle = searchQuery
    ? `No results for "${searchQuery}"`
    : "No brands found";

  const emptyDescription = searchQuery
    ? "Try a different search term."
    : "Add your first brand to get started.";

  return (
    <AdminListTemplate
      title="Brands"
      description="Manage your store's brands"
      headerAction={
        <Button asChild size="sm">
          <Link to="/admin/brands/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Brand
          </Link>
        </Button>
      }
      searchValue={searchQuery}
      onSearch={handleSearch}
      searchPlaceholder="Search brands…"
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      onRetry={() => refetch()}
      isEmpty={filteredBrands.length === 0}
      emptyIcon={<LayoutGrid className="h-8 w-8 text-muted-foreground/50" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={
        !searchQuery ? (
          <Button asChild size="sm">
            <Link to="/admin/brands/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Brand
            </Link>
          </Button>
        ) : undefined
      }
      items={filteredBrands}
      renderItem={(brand: Brand) => (
        <AdminBrandListItem
          key={brand._id}
          brand={brand}
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
        open={!!brandToDelete}
        onOpenChange={(open) => !open && setBrandToDelete(null)}
        title="Delete Brand"
        description={`Are you sure you want to delete "${brandToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </AdminListTemplate>
  );
};

export default BrandListPage;
