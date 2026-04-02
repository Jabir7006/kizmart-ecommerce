import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCart,
  removeProductFromCart,
  clearCart,
} from "../services/api/cart/cartApi";
import { useAuthStore } from "@/store/useAuthStore";
import { handleMutationError } from "@/utils/errorUtils";
import { toast } from "sonner";
import type { Cart } from "@/types/cartType";

export const useCartQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await getCart();
      return data.data;
    },
    enabled: isAuthenticated,
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
    onError: (error) => handleMutationError(error, "Failed to add to cart"),
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
    onError: (error) => handleMutationError(error, "Failed to update quantity"),
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
    onError: (error) => handleMutationError(error, "Failed to remove product"),
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => handleMutationError(error, "Failed to clear cart"),
  });
};
