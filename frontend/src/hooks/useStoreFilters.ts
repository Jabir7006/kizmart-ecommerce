import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/services/api/product/productApi";
import { productKeys } from "@/hooks/useProduct";
import type { ProductFilters, PaginatedProducts } from "@/types/productType";

// ── URL param keys ──────────────────────────────────────────────────────────
const PARAM_KEYS = {
  search: "q",
  category: "category",
  brand: "brand",
  minPrice: "minPrice",
  maxPrice: "maxPrice",
  sort: "sort",
  page: "page",
} as const;

const DEFAULT_LIMIT = 10;

// ── Parse URL → ProductFilters ──────────────────────────────────────────────
function parseFiltersFromParams(searchParams: URLSearchParams): ProductFilters {
  const search = searchParams.get(PARAM_KEYS.search) || undefined;
  const categorySlug = searchParams.get(PARAM_KEYS.category) || undefined;
  const brandSlug = searchParams.get(PARAM_KEYS.brand) || undefined;

  const rawMin = searchParams.get(PARAM_KEYS.minPrice);
  const minPrice = rawMin ? Number(rawMin) : undefined;

  const rawMax = searchParams.get(PARAM_KEYS.maxPrice);
  const maxPrice = rawMax ? Number(rawMax) : undefined;

  const rawSort = searchParams.get(PARAM_KEYS.sort);
  let sortBy: string | undefined;
  let sortOrder: "asc" | "desc" | undefined;
  if (rawSort) {
    const lastDash = rawSort.lastIndexOf("-");
    if (lastDash > 0) {
      sortBy = rawSort.slice(0, lastDash);
      sortOrder = rawSort.slice(lastDash + 1) as "asc" | "desc";
    }
  }

  const rawPage = searchParams.get(PARAM_KEYS.page);
  const page = rawPage ? Math.max(1, Number(rawPage)) : 1;

  return {
    search,
    categorySlug,
    brandSlug,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    page,
    limit: DEFAULT_LIMIT,
  };
}

// ── Serialize partial filter values → URLSearchParams ────────────────────────
function filtersToParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.search) params.set(PARAM_KEYS.search, filters.search);
  if (filters.categorySlug)
    params.set(PARAM_KEYS.category, filters.categorySlug);
  if (filters.brandSlug) params.set(PARAM_KEYS.brand, filters.brandSlug);
  if (filters.minPrice !== undefined)
    params.set(PARAM_KEYS.minPrice, String(filters.minPrice));
  if (filters.maxPrice !== undefined)
    params.set(PARAM_KEYS.maxPrice, String(filters.maxPrice));
  if (filters.sortBy && filters.sortOrder)
    params.set(PARAM_KEYS.sort, `${filters.sortBy}-${filters.sortOrder}`);
  if (filters.page > 1) params.set(PARAM_KEYS.page, String(filters.page));

  return params;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useStoreFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive filters from URL
  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()],
  );

  // Merge partial updates into the URL; resets page to 1 unless page is
  // explicitly part of the update
  const setFilters = useCallback(
    (incoming: Partial<ProductFilters>) => {
      setSearchParams(
        (prev) => {
          const current = parseFiltersFromParams(prev);
          const merged: ProductFilters = {
            ...current,
            ...incoming,
            // Reset to page 1 whenever a non-page filter changes
            page: "page" in incoming ? (incoming.page ?? 1) : 1,
            limit: DEFAULT_LIMIT,
          };
          return filtersToParams(merged);
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const setPage = useCallback(
    (page: number) => {
      setSearchParams(
        (prev) => {
          const current = parseFiltersFromParams(prev);
          return filtersToParams({ ...current, page });
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // ── Data fetching ────────────────────────────────────────────────────────
  const productsQuery = useQuery<PaginatedProducts>({
    queryKey: productKeys.list({ context: "store", ...filters }),
    queryFn: async () => {
      const response = await getAllProducts(filters);
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  return {
    // Query
    productsQuery,
    products: productsQuery.data?.data ?? [],
    metadata: productsQuery.data?.metadata,

    // Filter state (derived from URL)
    filters,
    setFilters,
    resetFilters,
    setPage,
  };
}
