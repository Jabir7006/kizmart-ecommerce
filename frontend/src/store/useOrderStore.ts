import { create } from "zustand";
import type { OrderFilters } from "../types/orderType";

interface OrderStore {
  filters: OrderFilters;
  currentOrderId: string | null;
  orderTotal: number | null;
  shippingFee: number | null;

  setFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  setCurrentOrderId: (orderId: string | null) => void;
  setOrderSummary: (total: number, shippingFee: number) => void;
  clearOrderSummary: () => void;
}

const initialFilters: OrderFilters = {
  status: undefined,
  startDate: undefined,
  endDate: undefined,
  page: 1,
  limit: 10,
};

export const useOrderStore = create<OrderStore>((set) => ({
  filters: { ...initialFilters },
  currentOrderId: null,
  orderTotal: null,
  shippingFee: null,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    })),

  resetFilters: () => set({ filters: { ...initialFilters } }),

  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),

  setCurrentOrderId: (orderId) => set({ currentOrderId: orderId }),

  setOrderSummary: (total, shippingFee) =>
    set({ orderTotal: total, shippingFee }),

  clearOrderSummary: () => set({ orderTotal: null, shippingFee: null }),
}));
