import { useOrders } from "@/hooks/useOrder";
import { useOrderStore } from "@/store/useOrderStore";
import OrderListItem from "@/components/order/OrderListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import { Package, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import type { Order } from "@/types/orderType";

const statusTabs: {
  label: string;
  value: Order["status"] | undefined;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    label: "All",
    value: undefined,
    activeClass: "bg-primary text-primary-foreground shadow-sm",
    inactiveClass: "bg-muted text-muted-foreground hover:bg-accent",
  },
  {
    label: "Pending",
    value: "pending",
    activeClass: "bg-amber-500 text-white shadow-sm",
    inactiveClass: "bg-amber-50 text-amber-700 hover:bg-amber-100",
  },
  {
    label: "Confirmed",
    value: "confirmed",
    activeClass: "bg-emerald-500 text-white shadow-sm",
    inactiveClass: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  {
    label: "Shipped",
    value: "shipped",
    activeClass: "bg-blue-500 text-white shadow-sm",
    inactiveClass: "bg-blue-50 text-blue-700 hover:bg-blue-100",
  },
  {
    label: "Delivered",
    value: "delivered",
    activeClass: "bg-green-600 text-white shadow-sm",
    inactiveClass: "bg-green-50 text-green-700 hover:bg-green-100",
  },
  {
    label: "Cancelled",
    value: "cancelled",
    activeClass: "bg-red-500 text-white shadow-sm",
    inactiveClass: "bg-red-50 text-red-700 hover:bg-red-100",
  },
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
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusTabs.map((tab) => {
          const isActive = filters.status === tab.value;
          return (
            <button
              key={tab.label}
              onClick={() => setFilters({ status: tab.value })}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer",
                isActive ? tab.activeClass : tab.inactiveClass,
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
