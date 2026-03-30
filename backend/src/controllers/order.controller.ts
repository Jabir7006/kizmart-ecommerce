import { HTTP_STATUS } from '../constants/http.js';
import {
  createOrder,
  getOrderById,
  getOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '../services/order.service.js';
import type { OrderQueryOptions } from '../types/order.types.js';
import catchAsync from '../utils/catchAsync.js';
import type { Request } from 'express';

const extractOrderQueryOptions = (req: Request): OrderQueryOptions => {
  const options: OrderQueryOptions = {};
  
  if (req.query.search) options.search = req.query.search as string;
  if (req.query.status) options.status = req.query.status as string;
  if (req.query.sortBy) options.sortBy = req.query.sortBy as string;
  if (req.query.sortOrder) options.sortOrder = req.query.sortOrder as 'asc' | 'desc';
  
  if (req.query.page) options.page = Math.max(1, Number(req.query.page));
  if (req.query.limit) options.limit = Math.min(100, Math.max(1, Number(req.query.limit)));
  
  if (req.query.startDate) options.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) options.endDate = new Date(req.query.endDate as string);
  
  return options;
};

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
  const options = extractOrderQueryOptions(req);

  const result = await getOrders(userId, options);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: result,
  });
});

export const handleGetAllOrders = catchAsync(async (req, res) => {
  const options = extractOrderQueryOptions(req);

  const result = await getAllOrders(options);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: result,
  });
});

export const handleCancelOrder = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const order = await cancelOrder(req.params.id as string, userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Order cancelled successfully',
    data: order,
  });
});

export const handleUpdateOrderStatus = catchAsync(async (req, res) => {
  const orderId = req.params.id as string;
  const { status } = req.body;

  const order = await updateOrderStatus(orderId, status);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Order status updated successfully',
    data: order,
  });
});
