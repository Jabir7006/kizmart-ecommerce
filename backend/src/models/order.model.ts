import { Document, Schema, Types, model } from 'mongoose';
import { applyGlobalTransform } from '../utils/mongoose.js';
import { type IImage, ImageSchema } from './product.model.js';

export interface IShippingSnapshot {
  fullName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  thumbnail: IImage;
  quantity: number;
  price: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingSnapshot;
  payment: Types.ObjectId;
  status: OrderStatus;
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const shippingSnapshotSchema = new Schema<IShippingSnapshot>(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { _id: false },
);

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: { type: String, required: true },
    thumbnail: { type: ImageSchema, required: true },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true },
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: [
        (v: IOrderItem[]) => v != null && v.length >= 1,
        'Order must have at least one item',
      ],
    },
    shippingAddress: {
      type: shippingSnapshotSchema,
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

orderSchema.plugin(applyGlobalTransform);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
