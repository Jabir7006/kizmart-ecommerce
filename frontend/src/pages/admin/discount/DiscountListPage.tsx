import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgePercent, Plus } from "lucide-react";
import { AdminListTemplate } from "@/components/ui/AdminListTemplate";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/button";
import ListItemSkeleton from "@/components/ui/ListItemSkeleton";
import AdminDiscountListItem from "@/components/admin/discount/AdminDiscountListItem";
import { useAdminDiscounts } from "@/hooks/useDiscount";
import type {
  Discount,
  DiscountFilters,
  DiscountStatus,
} from "@/types/discountType";

const statusTabs: { label: string; value: "all" | DiscountStatus }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Expired", value: "expired" },
  { label: "Inactive", value: "inactive" },
];

const discountTypeOptions: { label: string; value: "" | NonNullable<DiscountFilters["discountType"]> }[] = [
  { label: "All types", value: "" },
  { label: "Percentage", value: "percentage" },
  { label: "Fixed", value: "fixed" },
];

const targetTypeOptions: { label: string; value: "" | NonNullable<DiscountFilters["targetType"]> }[] = [
  { label: "All targets", value: "" },
  { label: "All products", value: "all" },
  { label: "Products", value: "product" },
  { label: "Categories", value: "category" },
];

interface FilterSelectProps {
  value?: string;
  options: { label: string; value: string }[];
  onChange: (value: string | undefined) => void;
  ariaLabel: string;
}

const FilterSelect = ({
  value,
  options,
  onChange,
  ariaLabel,
}: FilterSelectProps) => (
  <select
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value || undefined)}
    aria-label={ariaLabel}
    className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
  >
    {options.map((option) => (
      <option key={`${ariaLabel}-${option.value || "empty"}`} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const DiscountListPage = () => {
  const {
    discounts,
    metadata,
    discountsQuery,
    filters,
    setFilters,
    setPage,
    deleteDiscountMutation,
    toggleStatusMutation,
  } = useAdminDiscounts();

  const [discountToDelete, setDiscountToDelete] = useState<Discount | null>(null);

  const activeStatus = filters.status || "all";
  const { isLoading, isError, error, refetch } = discountsQuery;

  const handleSearch = (value: string) => {
    setFilters({ search: value || undefined });
  };

  const handleStatusTab = (status: string) => {
    setFilters({
      status:
        status === "all" ? undefined : (status as DiscountFilters["status"]),
    });
  };

  const handleDiscountTypeChange = (discountType: string | undefined) => {
    setFilters({
      discountType: discountType as DiscountFilters["discountType"],
    });
  };

  const handleTargetTypeChange = (targetType: string | undefined) => {
    setFilters({
      targetType: targetType as DiscountFilters["targetType"],
    });
  };

  const handleToggleStatus = async (discount: Discount) => {
    try {
      await toggleStatusMutation.mutateAsync(discount._id);
    } catch {
      // Error handled in hook
    }
  };

  const handleConfirmDelete = async () => {
    if (!discountToDelete) return;

    try {
      await deleteDiscountMutation.mutateAsync(discountToDelete._id);
    } catch {
      // Error handled in hook
    } finally {
      setDiscountToDelete(null);
    }
  };

  const emptyTitle = filters.search
    ? `No results for "${filters.search}"`
    : activeStatus !== "all"
      ? `No ${activeStatus} discounts found`
      : "No discounts found";

  const emptyDescription = filters.search
    ? "Try a different discount name."
    : filters.discountType || filters.targetType
      ? "Try adjusting the active filters."
      : "Create your first discount to start offering promotions.";

  return (
    <AdminListTemplate
      title="Discounts"
      description="Manage promotional pricing across your catalog"
      headerAction={
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <FilterSelect
            value={filters.discountType}
            options={discountTypeOptions}
            onChange={handleDiscountTypeChange}
            ariaLabel="Filter by discount type"
          />
          <FilterSelect
            value={filters.targetType}
            options={targetTypeOptions}
            onChange={handleTargetTypeChange}
            ariaLabel="Filter by target type"
          />
          <Button asChild size="sm">
            <Link to="/admin/discounts/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Discount
            </Link>
          </Button>
        </div>
      }
      searchValue={filters.search}
      onSearch={handleSearch}
      searchPlaceholder="Search discounts..."
      tabs={statusTabs}
      activeTab={activeStatus}
      onTabChange={handleStatusTab}
      isLoading={isLoading}
      isError={isError}
      error={error as Error}
      onRetry={() => refetch()}
      isEmpty={discounts.length === 0}
      emptyIcon={<BadgePercent className="h-8 w-8 text-muted-foreground/50" />}
      emptyTitle={emptyTitle}
      emptyDescription={emptyDescription}
      emptyAction={
        !filters.search && !filters.status && !filters.discountType && !filters.targetType ? (
          <Button asChild size="sm">
            <Link to="/admin/discounts/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Discount
            </Link>
          </Button>
        ) : undefined
      }
      items={discounts}
      renderItem={(discount) => (
        <AdminDiscountListItem
          key={discount._id}
          discount={discount}
          onDelete={setDiscountToDelete}
          onToggle={handleToggleStatus}
          isToggling={
            toggleStatusMutation.isPending &&
            toggleStatusMutation.variables === discount._id
          }
        />
      )}
      renderSkeleton={() => (
        <>
          {Array.from({ length: 6 }).map((_, index) => (
            <ListItemSkeleton
              key={index}
              descriptionLines={2}
              showMeta
            />
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
              itemLabel: "discount",
            }
          : undefined
      }
    >
      <ConfirmModal
        open={!!discountToDelete}
        onOpenChange={(open) => !open && setDiscountToDelete(null)}
        title="Delete Discount"
        description={`Are you sure you want to delete "${discountToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </AdminListTemplate>
  );
};

export default DiscountListPage;
