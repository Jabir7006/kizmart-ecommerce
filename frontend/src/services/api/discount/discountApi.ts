import type { DiscountFormOutput } from "@/schemas/discountSchema";
import type { DiscountFilters } from "@/types/discountType";
import api from "../api";

export const getDiscounts = async (filters: DiscountFilters) => {
  const params: Record<string, string | number> = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.search) params.q = filters.search;
  if (filters.status) params.status = filters.status;
  if (filters.discountType) params.discountType = filters.discountType;
  if (filters.targetType) params.targetType = filters.targetType;

  return api.get("/discounts", { params });
};

export const getDiscount = async (id: string) => api.get(`/discounts/${id}`);

export const createDiscount = async (data: DiscountFormOutput) =>
  api.post("/discounts", data);

export const updateDiscount = async (
  id: string,
  data: Partial<DiscountFormOutput>,
) => api.patch(`/discounts/${id}`, data);

export const deleteDiscount = async (id: string) =>
  api.delete(`/discounts/${id}`);

export const toggleDiscountStatus = async (id: string) =>
  api.patch(`/discounts/${id}/toggle`);
