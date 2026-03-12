import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCart,
  removeProductFromCart,
  clearCart,
} from "../services/api/cart/cartApi";
import { toast } from "sonner";
import type { Cart } from "@/types/cartType";
import type { AxiosError } from "axios";
import type { AxiosErrorType } from "@/types/errorType";

export const useCartQuery = () => {
  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await getCart();
      return data.data;
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product added to cart");
    },
    onError: (error: AxiosError<AxiosErrorType>) => {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    },
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Quantity updated");
    },
    onError: (error: AxiosError<AxiosErrorType>) => {
      toast.error(
        error?.response?.data?.message || "Failed to update quantity",
      );
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeProductFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Product removed from cart");
    },
    onError: (error: AxiosError<AxiosErrorType>) => {
      toast.error(error?.response?.data?.message || "Failed to remove product");
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
    onError: (error: AxiosError<AxiosErrorType>) => {
      toast.error(error?.response?.data?.message || "Failed to clear cart");
    },
  });
};
