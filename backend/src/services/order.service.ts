import { Types } from 'mongoose';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import Product from '../models/product.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import { QueryBuilder } from '../utils/queryBuilder.js';
import type {
  OrderInput,
  OrderQueryOptions,
  ShippingSnapshotInput,
} from '../types/order.types.js';
import type { PaginatedResult } from '../types/product.types.js';

export const createOrder = async (userId: string, payload: OrderInput) => {
  const { items, shippingAddress, paymentMethod } = payload;

  const orderItems: { product: Types.ObjectId; quantity: number; price: number }[] = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId).select('price').lean();
    if (!product) {
      throw new AppError(`Product not found: ${item.productId}`, HTTP_STATUS.NOT_FOUND);
    }
    const price = product.price;
    const qty = Math.max(1, item.quantity);
    orderItems.push({
      product: new Types.ObjectId(item.productId),
      quantity: qty,
      price,
    });
    subtotal += price * qty;
  }

  const shippingFee = 0;
  const total = subtotal + shippingFee;

  const payment = await Payment.create({
    method: paymentMethod,
    status: 'pending',
    amount: total,
  });

  const order = await Order.create({
    user: new Types.ObjectId(userId),
    items: orderItems,
    shippingAddress: shippingAddress as ShippingSnapshotInput,
    payment: payment._id,
    status: 'pending',
    subtotal,
    shippingFee,
    total,
  });

  await Payment.findByIdAndUpdate(payment._id, { order: order._id });

  const populated = await Order.findById(order._id)
    .populate('payment')
    .populate('items.product', 'title slug thumbnail price')
    .lean();

  return populated;
};

export const getOrderById = async (orderId: string, userId: string) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate('payment')
    .populate('items.product', 'title slug thumbnail price')
    .lean();

  if (!order) {
    throw new AppError('Order not found', HTTP_STATUS.NOT_FOUND);
  }
  return order;
};

export const getOrders = async (
  userId: string,
  options: OrderQueryOptions,
): Promise<PaginatedResult<unknown>> => {
  const baseMatch: Record<
    string,
    Types.ObjectId | string | { $gte?: Date; $lte?: Date }
  > = { user: new Types.ObjectId(userId) };

  if (options.status) {
    baseMatch.status = options.status;
  }
  if (options.startDate != null || options.endDate != null) {
    const dateRange: { $gte?: Date; $lte?: Date } = {};
    if (options.startDate != null) dateRange.$gte = options.startDate;
    if (options.endDate != null) dateRange.$lte = options.endDate;
    baseMatch.createdAt = dateRange;
  }

  const queryBuilder = new QueryBuilder({
    options: {
      sortBy: options.sortBy ?? 'createdAt',
      sortOrder: options.sortOrder ?? 'desc',
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
    baseMatch,
  });

  const pipeline = queryBuilder.buildPipeline();
  const result = await Order.aggregate(pipeline);

  const data = result[0]?.data ?? [];
  const total = result[0]?.metadata?.[0]?.total ?? 0;
  const limit = options.limit ?? 10;
  const page = options.page ?? 1;
  const totalPages = Math.ceil(total / limit);

  return {
    metadata: { total, page, totalPages, limit },
    data,
  };
};
