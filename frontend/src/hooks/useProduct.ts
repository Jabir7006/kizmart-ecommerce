import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllProducts,
  getProductBySlug,
  getSimilarProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/api/product/productApi";
import type { Product, PaginatedProducts, Image } from "@/types/productType";
import type { ProductFilters } from "@/types/productType";
import type {
  ProductEditFormOutput,
  ProductInput,
} from "@/schemas/productSchema";
import { processProductImages } from "@/utils/productImageUtils";
import { handleMutationError } from "@/utils/errorUtils";
import { toast } from "sonner";


// ─── Shared query-key factory ────────────────────────────────────────────────
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters: object) => [...productKeys.lists(), filters] as const,
  search: (q: string) => [...productKeys.all, "search", q] as const,
  detail: (slug: string) => ["product", slug] as const,
  similar: (slug: string, limit: number) =>
    [...productKeys.detail(slug), "similar", limit] as const,
};

// ─── Admin product list hook (URL-driven, per-page filters) ─────────────────

const ADMIN_PARAM_KEYS = {
  search: "q",
  status: "status",
  page: "page",
} as const;

const ADMIN_DEFAULT_LIMIT = 10;

function parseAdminFilters(searchParams: URLSearchParams): ProductFilters {
  const search = searchParams.get(ADMIN_PARAM_KEYS.search) || undefined;
  const status = searchParams.get(ADMIN_PARAM_KEYS.status) || undefined;
  const rawPage = searchParams.get(ADMIN_PARAM_KEYS.page);
  const page = rawPage ? Math.max(1, Number(rawPage)) : 1;
  return { search, status, page, limit: ADMIN_DEFAULT_LIMIT };
}

function adminFiltersToParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set(ADMIN_PARAM_KEYS.search, filters.search);
  if (filters.status && filters.status !== "all")
    params.set(ADMIN_PARAM_KEYS.status, filters.status);
  if (filters.page && filters.page > 1)
    params.set(ADMIN_PARAM_KEYS.page, String(filters.page));
  return params;
}

export function useAdminProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const filters = useMemo(
    () => parseAdminFilters(searchParams),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams.toString()],
  );

  const setFilters = useCallback(
    (incoming: Partial<ProductFilters>) => {
      setSearchParams(
        (prev) => {
          const current = parseAdminFilters(prev);
          const merged: ProductFilters = {
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

  const productsQuery = useQuery<PaginatedProducts>({
    queryKey: productKeys.list({ context: "admin", ...filters }),
    queryFn: async () => {
      const response = await getAllProducts(filters);
      return response.data.data;
    },
    placeholderData: (previousData) => previousData,
  });

  // ── DELETE (kept here so the admin list page is self-contained) ──────────
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteProduct(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete product"),
  });

  return {
    // Query
    productsQuery,
    products: productsQuery.data?.data ?? [],
    metadata: productsQuery.data?.metadata,

    // Filter state (URL-driven)
    filters,
    setFilters,
    setPage,

    // Mutation
    deleteProductMutation,
  };
}

// ─── Mutations-only hook (Create / Update / Delete) ──────────────────────────
const useProduct = () => {
  const queryClient = useQueryClient();

  // ── CREATE ──────────────────────────────────────────────────────────────
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductEditFormOutput) => {
      const { thumbnailData, galleryData } = await processProductImages({
        thumbnail: data.thumbnail as File | Image,
        gallery: data.gallery as (File | Image)[],
      });

      const payload: ProductInput = {
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        brand: data.brand || undefined,
        status: data.status,
        isFeatured: data.isFeatured,
        thumbnail: thumbnailData,
        gallery: galleryData.length > 0 ? galleryData : undefined,
      };

      const response = await createProduct(payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to create product"),
  });

  // ── UPDATE ──────────────────────────────────────────────────────────────
  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: ProductEditFormOutput;
    }) => {
      const { thumbnailData, galleryData } = await processProductImages({
        thumbnail: data.thumbnail as File | Image,
        gallery: data.gallery as (File | Image)[],
      });

      const payload: Partial<ProductInput> = {
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        price: data.price,
        quantity: data.quantity,
        category: data.category,
        brand: data.brand || undefined,
        status: data.status,
        isFeatured: data.isFeatured,
        thumbnail: thumbnailData,
        gallery: galleryData,
      };

      const response = await updateProduct(id, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success("Product updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to update product"),
  });

  // ── DELETE ──────────────────────────────────────────────────────────────
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteProduct(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to delete product"),
  });

  return {
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};

export default useProduct;

// ─── Single product by slug ──────────────────────────────────────────────────
export const useSingleProduct = (slug: string) => {
  return useQuery<Product>({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const response = await getProductBySlug(slug);
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSimilarProducts = (slug: string, limit = 8) => {
  return useQuery<Product[]>({
    queryKey: productKeys.similar(slug, limit),
    queryFn: async () => {
      const response = await getSimilarProducts(slug, limit);
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Dropdown / header search ────────────────────────────────────────────────
export const useSearchProducts = (searchQuery: string) => {
  return useQuery<PaginatedProducts>({
    queryKey: productKeys.search(searchQuery),
    queryFn: async () => {
      const response = await getAllProducts({
        search: searchQuery,
        limit: 5,
        page: 1,
      });
      return response.data.data;
    },
    enabled: !!searchQuery,
    staleTime: 60 * 1000,
  });
};

// ─── New arrivals section ────────────────────────────────────────────────────
export const useNewArrivalsProducts = () => {
  const filters = {
    sortBy: "createdAt",
    sortOrder: "desc" as const,
    limit: 10,
    page: 1,
  };
  return useQuery<PaginatedProducts>({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const response = await getAllProducts(filters);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

// ─── Featured products section ───────────────────────────────────────────────
export const useFeaturedProducts = () => {
  const filters = {
    isFeatured: true,
    sortBy: "createdAt",
    limit: 5,
    page: 1,
  };
  return useQuery<PaginatedProducts>({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      const response = await getAllProducts(filters);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
