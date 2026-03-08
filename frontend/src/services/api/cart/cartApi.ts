import type { CartItemInput } from "@/types/cartType";
import api from "../api";

export const addToCart = async ({ productId, quantity }: CartItemInput) =>
  api.post("/carts/add", { productId, quantity });

export const getCart = async () => api.get("/carts");

export const updateCart = async ({ productId, quantity }: CartItemInput) =>
  api.patch("/carts/update-quantity", { productId, quantity });

export const removeProductFromCart = async (productId: string) =>
  api.delete("/carts/remove", { data: { productId } });

export const clearCart = async () => api.delete("/carts/clear");
