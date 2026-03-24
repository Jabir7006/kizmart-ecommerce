import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import {
  PageHeader,
  PageHeaderInfo,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
} from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import Pagination from "@/components/ui/Pagination";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

interface AdminListTemplateProps<T> {
  // Header
  title: string;
  description: string;
  headerAction?: ReactNode;

  // Search & Filters
  searchValue?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;

  tabs?: { label: string; value: string }[];
  activeTab?: string;
  onTabChange?: (value: string) => void;

  // State
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  isEmpty: boolean;

  // Empty State config
  emptyIcon?: ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  emptyAction?: ReactNode;

  // Data & Rendering
  items: T[];
  renderItem: (item: T) => ReactNode;
  renderSkeleton: () => ReactNode;

  // Pagination
  pagination?: {
    page: number;
    totalPages: number;
    total: number;
    onPageChange: (page: number) => void;
    itemLabel: string;
  };

  // Modals / Extras
  children?: ReactNode;
}

export function AdminListTemplate<T>({
  title,
  description,
  headerAction,
  searchValue,
  onSearch,
  searchPlaceholder,
  tabs,
  activeTab,
  onTabChange,
  isLoading,
  isError,
  error,
  onRetry,
  isEmpty,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  items,
  renderItem,
  renderSkeleton,
  pagination,
  children,
}: AdminListTemplateProps<T>) {
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* ── Page Header ── */}
        <PageHeader>
          <PageHeaderInfo>
            <PageHeaderTitle>{title}</PageHeaderTitle>
            <PageHeaderDescription>{description}</PageHeaderDescription>
          </PageHeaderInfo>
          {headerAction && (
            <PageHeaderActions>{headerAction}</PageHeaderActions>
          )}
        </PageHeader>

        {/* ── Search & Tabs ── */}
        {(onSearch || (tabs && tabs.length > 0)) && (
          <div className="flex flex-col gap-3">
            {onSearch && (
              <SearchBar
                value={searchValue || ""}
                placeholder={searchPlaceholder || "Search..."}
                onSearch={onSearch}
                maxWidth="max-w-sm"
              />
            )}

            {tabs && tabs.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b items-center">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => onTabChange?.(tab.value)}
                      className={cn(
                        "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer -mb-px",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── List Content ── */}
        <div className="flex flex-col gap-2">
          {/* Loading skeletons */}
          {isLoading && renderSkeleton()}

          {/* Error state */}
          {isError && !isLoading && (
            <ErrorState
              title={`Failed to load ${title.toLowerCase()}`}
              description={
                error?.message || "Something went wrong. Please try again."
              }
              onRetry={onRetry}
            />
          )}

          {/* Empty state */}
          {isEmpty && !isLoading && !isError && (
            <EmptyState
              icon={emptyIcon}
              title={emptyTitle}
              description={emptyDescription}
              action={emptyAction}
            />
          )}

          {/* List items */}
          {!isLoading && !isError && !isEmpty && items.map(renderItem)}
        </div>

        {/* ── Pagination ── */}
        {pagination && !isLoading && !isError && items.length > 0 && (
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            itemLabel={pagination.itemLabel}
            className="mt-2"
          />
        )}
      </div>

      {/* Render modals like ConfirmDelete here */}
      {children}
    </AdminLayout>
  );
}
