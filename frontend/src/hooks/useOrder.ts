import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import {
  createOrder,
  type CreateOrderPayload,
} from "@/services/api/order/orderApi";
import type { AxiosErrorType } from "@/types/errorType";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Order placed successfully");
    },
    onError: (error: AxiosError<AxiosErrorType>) => {
      toast.error(error?.response?.data?.message || "Failed to place order");
    },
  });
};
