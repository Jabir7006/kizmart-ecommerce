import { create } from "zustand";
import type { Product, ProductFilters } from "../types/productType";

interface ProductStore {
  // ── Filters & Pagination ──
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;

  // ── Selected Product ──
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

const initialFilters: ProductFilters = {
  search: undefined,
  categorySlug: undefined,
  brandSlug: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: undefined,
  sortOrder: undefined,
  page: 1,
  limit: 10,
};

export const useProductStore = create<ProductStore>((set) => ({
  // ── Filters & Pagination ──
  filters: { ...initialFilters },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  resetFilters: () => set({ filters: { ...initialFilters } }),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  // ── Selected Product ──
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
