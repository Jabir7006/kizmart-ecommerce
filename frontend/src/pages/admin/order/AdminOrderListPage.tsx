import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";

import { ShoppingCart } from "lucide-react";
import { AdminListTemplate } from "@/components/ui/AdminListTemplate";
import AdminOrderListItem from "@/components/admin/order/AdminOrderListItem";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import { useAdminOrders } from "@/hooks/useOrder";
import type { OrderFilters } from "@/types/orderType";

const statusTabs: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const AdminOrderListPage = () => {
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
  });
  
  // We use "all" for UI, but the API expects undefined for all statuses.
  const activeStatus = useMemo(() => filters.status || "all", [filters.status]);

  const { data, isLoading, isError, error, refetch } = useAdminOrders(filters);

  const orders = data?.data ?? [];
  const metadata = data?.metadata;

  /* ── Handlers ── */
  const handleStatusTab = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: status === "all" ? undefined : (status as OrderFilters["status"]),
    }));
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      search: value || undefined,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [name]: value || undefined,
    }));
  };

  /* ── Empty state helpers ── */
  const emptyTitle =
    activeStatus !== "all"
      ? `No ${activeStatus} orders yet`
      : "No orders found";

  const emptyDescription =
    activeStatus !== "all"
      ? `There are no ${activeStatus} orders in the system.`
      : "As customers place orders, they will appear here.";

  return (
    <AdminListTemplate
      title="Orders"
      description="Manage and track store orders"
      headerAction={
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Input
            type="date"
            name="startDate"
            value={filters.startDate || ""}
            onChange={handleDateChange}
            className="w-[150px] h-9 text-sm"
            aria-label="Start Date"
          />
          <span className="text-muted-foreground hidden sm:inline">-</span>
          <Input
            type="date"
            name="endDate"
            value={filters.endDate || ""}
            onChange={handleDateChange}
            className="w-[150px] h-9 text-sm"
            aria-label="End Date"
          />
        </div>
      }
      searchValue={filters.search}
      onSearch={handleSearch}
      searchPlaceholder="Search order ID or user email…"
      tabs={statusTabs}
      activeTab={activeStatus}
      onTabChange={handleStatusTab}
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      onRetry={() => refetch()}
      isEmpty={orders.length === 0}
      emptyIcon={<ShoppingCart className="h-8 w-8 text-muted-foreground/50" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      items={orders}
      renderItem={(order) => (
        <AdminOrderListItem key={order._id} order={order} />
      )}
      renderSkeleton={() => (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <ListItemSkeleton key={i} showImage descriptionLines={1} showMeta={false} />
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
              itemLabel: "order",
            }
          : undefined
      }
    />
  );
};

export default AdminOrderListPage;
