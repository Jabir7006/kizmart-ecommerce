import type { Product, Image } from "./productType";

export interface OrderItem {
  _id: string;
  product: Pick<Product, "_id" | "title" | "price"> & { thumbnail: Image };
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

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cod" | "card" | "upi" | "bank_transfer";
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
  paymentStatus?: Order["paymentStatus"];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface OrderListResponse {
  status: string;
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderResponse {
  status: string;
  data: Order;
}
