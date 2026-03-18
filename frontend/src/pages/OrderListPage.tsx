import { useOrders } from "@/hooks/useOrder";
import { useOrderStore } from "@/store/useOrderStore";
import OrderListItem from "@/components/order/OrderListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import { Package, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orderType";

const statusTabs: { label: string; value: Order["status"] | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const OrderListPage = () => {
  const filters = useOrderStore((s) => s.filters);
  const setFilters = useOrderStore((s) => s.setFilters);
  const setPage = useOrderStore((s) => s.setPage);

  const { data, isLoading, isError, error, refetch } = useOrders(filters);

  const orders = data?.data ?? [];
  const pagination = data?.metadata;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* ── Status Tabs ── */}
      <div className="mb-6 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setFilters({ status: tab.value })}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-3">
        {/* Loading */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <ListItemSkeleton key={i} />)}

        {/* Error */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-10 text-center">
            <AlertCircle className="mb-3 h-10 w-10 text-destructive/60" />
            <h3 className="text-sm font-semibold text-destructive">
              Failed to load orders
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {error?.message || "Something went wrong. Please try again."}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-14 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Package className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-sm font-semibold">No orders yet</h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              {filters.status
                ? `You don't have any ${filters.status} orders.`
                : "When you place an order, it will appear here."}
            </p>
          </div>
        )}

        {/* Orders */}
        {!isLoading &&
          !isError &&
          orders.map((order) => (
            <OrderListItem key={order._id} order={order} />
          ))}
      </div>

      {/* ── Pagination ── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ·{" "}
            {pagination.total} order{pagination.total !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
