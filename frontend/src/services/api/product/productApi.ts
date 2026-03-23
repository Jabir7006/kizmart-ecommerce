import type { ProductFilters } from "@/types/productType";
import api from "../api";
import type { ProductInput } from "@/schemas/productSchema";

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
  if (filters.status) params.status = filters.status;

  return api.get("/products", { params });
};

export const getProductBySlug = async (slug: string) =>
  api.get(`/products/${slug}`);

export const createProduct = async (data: ProductInput) =>
  api.post("/products/create", data);
