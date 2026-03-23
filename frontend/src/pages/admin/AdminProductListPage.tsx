import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import ConfirmModal from "@/components/ui/ConfirmModal";
import AdminProductListItem from "@/components/admin/product/AdminProductListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import SearchBar from "@/components/ui/SearchBar";
import {
  PageHeader,
  PageHeaderInfo,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useProduct from "@/hooks/useProduct";
import type { Product } from "@/types/productType";
import { toast } from "sonner";

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
  } = useProduct();

  useEffect(() => {
    setFilters({ status: "all" });
    return () => setFilters({ status: undefined });
  }, [setFilters]);

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
    await deleteProductMutation.mutateAsync(productToDelete._id);
    toast.success("Product deleted successfully");
    setProductToDelete(null);
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
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* ── Page Header ── */}
        <PageHeader>
          <PageHeaderInfo>
            <PageHeaderTitle>Products</PageHeaderTitle>
            <PageHeaderDescription>
              Manage your store's product catalogue
            </PageHeaderDescription>
          </PageHeaderInfo>
          <PageHeaderActions>
            <Button asChild size="sm">
              <Link to="/admin/products/new">
                <Plus className="mr-1.5 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </PageHeaderActions>
        </PageHeader>

        {/* ── Search + Status Tabs ── */}
        <div className="flex flex-col gap-3">
          <SearchBar
            value={filters.search}
            placeholder="Search products…"
            onSearch={handleSearch}
            maxWidth="max-w-sm"
          />

          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b items-center">
            {statusTabs.map((tab) => {
              const isActive = activeStatus === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => handleStatusTab(tab.value)}
                  className={cn(
                    "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer -mb-px",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product List ── */}
        <div className="flex flex-col gap-2">
          {/* Loading skeletons */}
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <ListItemSkeleton
                key={i}
                showImage
                descriptionLines={2}
                showMeta
              />
            ))}

          {/* Error */}
          {isError && !isLoading && (
            <ErrorState
              title="Failed to load products"
              description={
                (error as Error)?.message ||
                "Something went wrong. Please try again."
              }
              onRetry={() => refetch()}
            />
          )}

          {/* Empty state */}
          {!isLoading && !isError && products.length === 0 && (
            <EmptyState
              icon={<Package className="h-8 w-8 text-muted-foreground/50" />}
              title={emptyTitle}
              description={emptyDescription}
              action={
                !filters.search && activeStatus === "all" ? (
                  <Button asChild size="sm">
                    <Link to="/admin/products/new">
                      <Plus className="mr-1.5 h-4 w-4" />
                      Add Product
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          )}

          {/* Product items */}
          {!isLoading &&
            !isError &&
            products.map((product) => (
              <AdminProductListItem
                key={product._id}
                product={product}
                onDelete={handleDelete}
              />
            ))}
        </div>

        {/* ── Pagination ── */}
        {metadata && (
          <Pagination
            page={metadata.page}
            totalPages={metadata.totalPages}
            total={metadata.total}
            onPageChange={setPage}
            itemLabel="product"
            className="mt-2"
          />
        )}
      </div>

      <ConfirmModal
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        title="Delete Product"
        description={`Are you sure you want to delete "${productToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
};

export default AdminProductListPage;
