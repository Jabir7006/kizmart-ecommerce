import type { AxiosResponse } from "axios";
import api from "../api";
import type {
  OrderFilters,
  OrderListResponse,
  Order,
  ShippingAddress,
} from "@/types/orderType";

export type CreateOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod: "cash_on_delivery";
};

export const getOrders = async (
  filters: OrderFilters,
): Promise<AxiosResponse<{ status: string; data: OrderListResponse }>> => {
  const params = new URLSearchParams();

  if (filters.status) params.append("status", filters.status);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  params.append("page", String(filters.page || 1));
  params.append("limit", String(filters.limit || 10));

  return api.get(`/orders?${params.toString()}`);
};

export const getAllOrders = async (
  filters: OrderFilters,
): Promise<AxiosResponse<{ status: string; data: OrderListResponse }>> => {
  const params = new URLSearchParams();

  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.startDate) params.append("startDate", filters.startDate);
  if (filters.endDate) params.append("endDate", filters.endDate);
  params.append("page", String(filters.page || 1));
  params.append("limit", String(filters.limit || 10));

  return api.get(`/orders/all?${params.toString()}`);
};

export const getOrderById = async (
  orderId: string,
): Promise<AxiosResponse<{ data: Order }>> => {
  return api.get(`/orders/${orderId}`);
};

export const createOrder = (
  payload: CreateOrderPayload,
): Promise<AxiosResponse<any>> => {
  return api.post("/orders", payload);
};

export const cancelOrder = (
  orderId: string,
): Promise<AxiosResponse<{ status: string; message: string }>> => {
  return api.patch(`/orders/${orderId}/cancel`);
};

export const updateOrderStatus = (
  orderId: string,
  status: Order["status"],
): Promise<AxiosResponse<{ status: string; message: string }>> => {
  return api.patch(`/orders/${orderId}/status`, { status });
};
