import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleMutationError } from "@/utils/errorUtils";
import {
  createOrder,
  getOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  type CreateOrderPayload,
} from "@/services/api/order/orderApi";
import type { Order } from "@/types/orderType";
import type { OrderFilters } from "@/types/orderType";

export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const { data } = await getOrders(filters);
      return data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: ["admin_orders", filters],
    queryFn: async () => {
      const { data } = await getAllOrders(filters);
      return data.data;
    },
    placeholderData: (previousData) => previousData,
  });
};

export const useOrderById = (orderId: string | null) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data } = await getOrderById(orderId!);
      return data.data;
    },
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(response?.data?.message || "Order placed successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to place order"),
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => cancelOrder(orderId),
    onSuccess: (response, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success(response?.data?.message || "Order cancelled successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to cancel order"),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order["status"] }) =>
      updateOrderStatus(orderId, status),
    onSuccess: (response, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["admin_orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      toast.success(response?.data?.message || "Order status updated successfully");
    },
    onError: (error) => handleMutationError(error, "Failed to update order status"),
  });
};
