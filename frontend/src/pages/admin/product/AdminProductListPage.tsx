import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import { AdminListTemplate } from "@/components/ui/AdminListTemplate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminProductListItem from "@/components/admin/product/AdminProductListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import { Button } from "@/components/ui/button";
import { useAdminProducts } from "@/hooks/useProduct";
import type { Product } from "@/types/productType";

const statusTabs: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Draft", value: "draft" },
  { label: "Archived", value: "archived" },
];

const AdminProductListPage = () => {
  const {
    products,
    metadata,
    productsQuery,
    filters,
    setFilters,
    setPage,
    deleteProductMutation,
  } = useAdminProducts();


  const activeStatus = filters.status || "all";
  const { isLoading, isError, error, refetch } = productsQuery;
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  /* ── Handlers ── */
  const handleSearch = (value: string) => {
    setFilters({ search: value || undefined });
  };

  const handleStatusTab = (status: string) => {
    setFilters({ status });
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductMutation.mutateAsync(productToDelete._id);
    } catch {
      // Error handled by the hook
    } finally {
      setProductToDelete(null);
    }
  };

  /* ── Empty state helpers ── */
  const emptyTitle = filters.search
    ? `No results for "${filters.search}"`
    : activeStatus !== "all"
      ? `No ${activeStatus} products yet`
      : "No products found";

  const emptyDescription = filters.search
    ? "Try a different search term."
    : activeStatus !== "all"
      ? `You don't have any ${activeStatus} products.`
      : "Add your first product to get started.";

  return (
    <AdminListTemplate
      title="Products"
      description="Manage your store's product catalogue"
      headerAction={
        <Button asChild size="sm">
          <Link to="/admin/products/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      }
      searchValue={filters.search}
      onSearch={handleSearch}
      searchPlaceholder="Search products…"
      tabs={statusTabs}
      activeTab={activeStatus}
      onTabChange={handleStatusTab}
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      onRetry={() => refetch()}
      isEmpty={products.length === 0}
      emptyIcon={<Package className="h-8 w-8 text-muted-foreground/50" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={
        !filters.search && activeStatus === "all" ? (
          <Button asChild size="sm">
            <Link to="/admin/products/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        ) : undefined
      }
      items={products}
      renderItem={(product) => (
        <AdminProductListItem
          key={product._id}
          product={product}
          onDelete={handleDelete}
        />
      )}
      renderSkeleton={() => (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <ListItemSkeleton key={i} showImage descriptionLines={2} showMeta />
          ))}
        </>
      )}
      pagination={
        metadata
          ? {
              page: metadata.page,
              totalPages: metadata.totalPages,
              total: metadata.total,
              onPageChange: setPage,
              itemLabel: "product",
            }
          : undefined
      }
    >
      <ConfirmModal
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </AdminListTemplate>
  );
};

export default AdminProductListPage;
