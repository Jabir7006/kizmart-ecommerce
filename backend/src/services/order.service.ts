import mongoose, { Types } from 'mongoose';
import Order from '../models/order.model.js';
import Payment from '../models/payment.model.js';
import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import { QueryBuilder } from '../utils/queryBuilder.js';
import type { OrderInput, OrderQueryOptions } from '../types/order.types.js';
import type { PaginatedResult } from '../types/product.types.js';
import { OrderStatus, PaymentStatus } from '../constants/status.js';
import { lockUserCart, resetCart } from './cart.service.js';
import {
  fetchProductMap,
  deductInventoryOrThrow,
} from './inverntory.service.js';
import { prepareOrderData } from '../utils/prepareOrderData.js';

export const createOrder = async (userId: string, payload: OrderInput) => {
  const { shippingAddress, paymentMethod } = payload;
  const session = await mongoose.startSession();

  try {
    const result = await session.withTransaction(async () => {
      // 1. Lock cart
      const cart = await lockUserCart(userId, session);

      // 2. Load products
      const productMap = await fetchProductMap(cart.items, session);

      // 3. Deduct inventory atomically
      await deductInventoryOrThrow(cart.items, productMap, session);

      // 4. Calculate subtotal & format items
      const { subtotal, orderItems, total } = prepareOrderData(
        cart.items,
        productMap,
        shippingAddress.city,
      );

      // 5. Create Order & Payment
      const paymentId = new mongoose.Types.ObjectId();

      const [newOrder] = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            subtotal: subtotal,
            total: total,
            status: OrderStatus.PENDING,
            shippingAddress,
            payment: paymentId,
          },
        ],
        { session },
      );

      if (!newOrder)
        throw new AppError(
          'Order creation failed',
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );

      const [payment] = await Payment.create(
        [
          {
            _id: paymentId,
            order: newOrder._id,
            amount: total,
            method: paymentMethod,
            status: PaymentStatus.PENDING,
          },
        ],
        { session },
      );

      if (!payment)
        throw new AppError(
          'Payment creation failed',
          HTTP_STATUS.INTERNAL_SERVER_ERROR,
        );

      // 6. Reset cart
      await resetCart(cart._id, session);

      return { orderId: newOrder._id };
    });

    // 7. Fetch populated order outside transaction
    return await Order.findById(result.orderId).populate('payment').lean();
  } finally {
    await session.endSession();
  }
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
