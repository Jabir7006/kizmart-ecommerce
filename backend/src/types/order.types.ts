import type { BaseQueryOptions } from '../utils/queryBuilder.js';

export type OrderItemInput = {
  productId: string;
  quantity: number;
};

export type ShippingSnapshotInput = {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
};

export type OrderInput = {
  items: OrderItemInput[];
  shippingAddress: ShippingSnapshotInput;
  paymentMethod: 'cash_on_delivery';
};

export interface OrderQueryOptions extends BaseQueryOptions {
  status?: string;
  startDate?: Date;
  endDate?: Date;
}
