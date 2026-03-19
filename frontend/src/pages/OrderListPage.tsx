import { useOrders } from "@/hooks/useOrder";
import { useOrderStore } from "@/store/useOrderStore";
import OrderListItem from "@/components/order/OrderListItem";
import ErrorState from "@/components/ui/ErrorState";
import { Package } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orderType";

const statusTabs: {
  label: string;
  value: Order["status"] | undefined;
}[] = [
  { label: "All Orders", value: undefined },
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* ── Header ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* ── Status Tabs ── */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none items-center border-b">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setFilters({ status: tab.value })}
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

      {/* ── Content ── */}
      <div className="flex flex-col gap-6">
        {/* Loading */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border bg-card"
            >
              <div className="h-16 bg-muted/50 px-6 py-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <div className="p-6">
                <Skeleton className="h-14 w-full max-w-75" />
              </div>
            </div>
          ))}

        {/* Error */}
        {isError && !isLoading && (
          <ErrorState
            title="Failed to load orders"
            description={
              error?.message || "Something went wrong. Please try again."
            }
            onRetry={() => refetch()}
          />
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
      {pagination && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={setPage}
          itemLabel="order"
          className="mt-8"
        />
      )}
    </div>
  );
};

export default OrderListPage;
