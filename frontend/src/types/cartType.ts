import type { Product } from "./productType";

export interface CartItemInput {
  productId: string;
  quantity?: number;
}

export interface CartItem {
  _id: string;
  product: Pick<Product, "_id" | "title" | "price" | "thumbnail">;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice: number;
  status: "active" | "ordered" | "abandoned";
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  status: string;
  data: Cart;
}
