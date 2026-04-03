import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getDiscounts,
  getDiscount,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
} from "@/services/api/discount/discountApi";
import type { DiscountFormOutput } from "@/schemas/discountSchema";
import type {
  Discount,
  DiscountFilters,
  PaginatedDiscounts,
} from "@/types/discountType";
import { handleMutationError } from "@/utils/errorUtils";
import { toast } from "sonner";


// ─── Shared query-key factory ────────────────────────────────────────────────
export const discountKeys = {
  all: ["discounts"] as const,
  lists: () => [...discountKeys.all, "list"] as const,
  list: (filters: object) => [...discountKeys.lists(), filters] as const,
  detail: (id: string) => ["discount", id] as const,
};

const ADMIN_PARAM_KEYS = {
  search: "q",
  status: "status",
  discountType: "discountType",
  targetType: "targetType",
  page: "page",
} as const;

const ADMIN_DEFAULT_LIMIT = 10;

function parseAdminFilters(searchParams: URLSearchParams): DiscountFilters {
  const search = searchParams.get(ADMIN_PARAM_KEYS.search) || undefined;
  const status =
    (searchParams.get(ADMIN_PARAM_KEYS.status) as DiscountFilters["status"]) ||
    undefined;
  const discountType =
    (searchParams.get(
      ADMIN_PARAM_KEYS.discountType,
    ) as DiscountFilters["discountType"]) || undefined;
  const targetType =
    (searchParams.get(
      ADMIN_PARAM_KEYS.targetType,
    ) as DiscountFilters["targetType"]) || undefined;
  const rawPage = searchParams.get(ADMIN_PARAM_KEYS.page);
  const page = rawPage ? Math.max(1, Number(rawPage)) : 1;

  return {
    search,
    status,
    discountType,
    targetType,
    page,
    limit: ADMIN_DEFAULT_LIMIT,
  };
}

function adminFiltersToParams(filters: DiscountFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set(ADMIN_PARAM_KEYS.search, filters.search);
  if (filters.status) params.set(ADMIN_PARAM_KEYS.status, filters.status);
  if (filters.discountType) {
    params.set(ADMIN_PARAM_KEYS.discountType, filters.discountType);
  }
  if (filters.targetType) {
    params.set(ADMIN_PARAM_KEYS.targetType, filters.targetType);
  }
  if (filters.page > 1) params.set(ADMIN_PARAM_KEYS.page, String(filters.page));

  return params;
}

export function useAdminDiscounts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const filters = useMemo(
    () => parseAdminFilters(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()],
  );

  const setFilters = useCallback(
    (incoming: Partial<DiscountFilters>) => {
      setSearchParams(
        (prev) => {
          const current = parseAdminFilters(prev);
          const merged: DiscountFilters = {
            ...current,
            ...incoming,
            page: "page" in incoming ? (incoming.page ?? 1) : 1,
            limit: ADMIN_DEFAULT_LIMIT,
          };

          return adminFiltersToParams(merged);
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      setSearchParams(
        (prev) => {
          const current = parseAdminFilters(prev);
          return adminFiltersToParams({ ...current, page });
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const discountsQuery = useQuery<PaginatedDiscounts>({
    queryKey: discountKeys.list({ context: "admin", ...filters }),
    queryFn: async () => {
      const response = await getDiscounts(filters);
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  const deleteDiscountMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteDiscount(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.all });
      toast.success(data.message || "Discount deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete discount"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await toggleDiscountStatus(id);
      return response.data;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.all });
      queryClient.invalidateQueries({ queryKey: discountKeys.detail(id) });
      toast.success(data.message || "Discount status updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to toggle status"),
  });

  return {
    discountsQuery,
    discounts: discountsQuery.data?.data ?? [],
    metadata: discountsQuery.data?.metadata,
    filters,
    setFilters,
    setPage,
    deleteDiscountMutation,
    toggleStatusMutation,
  };
}

// ─── Mutations-only hook ───────────────────────────────────────────────────
export const useDiscount = () => {
  const queryClient = useQueryClient();

  const createDiscountMutation = useMutation({
    mutationFn: async (data: DiscountFormOutput) => {
      const response = await createDiscount(data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.all });
      toast.success(data.message || "Discount created successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to create discount"),
  });

  const updateDiscountMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<DiscountFormOutput>;
    }) => {
      const response = await updateDiscount(id, data);
      return response.data;
    },
    onSuccess: (data, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.all });
      queryClient.invalidateQueries({ queryKey: discountKeys.detail(id) });
      toast.success(data.message || "Discount updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to update discount"),
  });

  const deleteDiscountMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteDiscount(id);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.all });
      toast.success(data.message || "Discount deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete discount"),
  });

  return {
    createDiscountMutation,
    updateDiscountMutation,
    deleteDiscountMutation,
  };
};

export const useSingleDiscount = (id: string, enabled = true) => {
  return useQuery<Discount>({
    queryKey: discountKeys.detail(id),
    queryFn: async () => {
      const response = await getDiscount(id);
      return response.data.data;
    },
    enabled: !!id && enabled,
    staleTime: 5 * 60 * 1000,
  });
};
