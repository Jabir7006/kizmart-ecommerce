import { HTTP_STATUS } from '../constants/http.js';
import {
  createOrder,
  getOrderById,
  getOrders,
} from '../services/order.service.js';
import type { OrderQueryOptions } from '../types/order.types.js';
import catchAsync from '../utils/catchAsync.js';

export const handleCreateOrder = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const order = await createOrder(userId, req.body);

  res.status(HTTP_STATUS.CREATED).json({
    status: 'success',
    message: 'Order placed successfully',
    data: order,
  });
});

export const handleGetOrder = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const order = await getOrderById(req.params.id as string, userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: order,
  });
});

export const handleGetOrders = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const options: OrderQueryOptions = {
    status: req.query.status as string,
    sortBy: req.query.sortBy as string,
    sortOrder: req.query.sortOrder as 'asc' | 'desc',
    page: req.query.page ? Math.max(1, Number(req.query.page)) : undefined,
    limit: req.query.limit
      ? Math.min(100, Math.max(1, Number(req.query.limit)))
      : undefined,
  };
  if (req.query.startDate) {
    options.startDate = new Date(req.query.startDate as string);
  }
  if (req.query.endDate) {
    options.endDate = new Date(req.query.endDate as string);
  }

  const result = await getOrders(userId, options);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: result,
  });
});
