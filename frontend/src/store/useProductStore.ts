import { create } from "zustand";
import type { Product } from "../types/productType";

interface ProductStore {
  // ── Selected Product (Quick-View) ──
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
