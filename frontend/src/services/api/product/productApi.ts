import type { ProductFilters } from "@/types/productType";
import api from "../api";

export const getAllProducts = async (filters: ProductFilters) => {
  const params: Record<string, string | number> = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.search) params.q = filters.search;
  if (filters.categorySlug) params.categorySlug = filters.categorySlug;
  if (filters.brandSlug) params.brandSlug = filters.brandSlug;
  if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
  if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  return api.get("/products", { params });
};

export const getProductBySlug = async (slug: string) => api.get(`/products/${slug}`);
