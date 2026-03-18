import type { Image } from "./productType";

export interface OrderItem {
  _id: string;
  product: string;
  title: string;
  thumbnail: Image;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface Payment {
  _id: string;
  method: "cash_on_delivery" | "card" | "upi" | "bank_transfer";
  status: "pending" | "paid" | "failed" | "refunded";
  amount: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingAddress: ShippingAddress;
  payment: string | Payment;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod" | "card" | "upi" | "bank_transfer";
}

export interface OrderFilters {
  status?: Order["status"];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OrderListResponse {
  metadata: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
  data: Order[];
}

export interface OrderResponse {
  status: string;
  data: Order;
}
