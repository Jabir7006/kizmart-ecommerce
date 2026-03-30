import express from 'express';
import {
  handleCreateOrder,
  handleGetOrder,
  handleGetOrders,
  handleCancelOrder,
  handleGetAllOrders,
  handleUpdateOrderStatus,
} from '../controllers/order.controller.js';
import {
  createOrderSchema,
  getOrderSchema,
  getOrdersSchema,
  cancelOrderSchema,
  updateOrderStatusSchema,
} from '../schemas/order.schema.js';
import validate from '../middlewares/validate.middleware.js';
import { restrictTo } from '../middlewares/auth.middleware.js';

const orderRoute = express.Router();

orderRoute.post('/', validate(createOrderSchema), handleCreateOrder);
orderRoute.get('/', validate(getOrdersSchema), handleGetOrders);
orderRoute.get('/all', restrictTo('admin', 'manager'), validate(getOrdersSchema), handleGetAllOrders);
orderRoute.patch(
  '/:id/status',
  restrictTo('admin', 'manager'),
  validate(updateOrderStatusSchema),
  handleUpdateOrderStatus
);
orderRoute.get('/:id', validate(getOrderSchema), handleGetOrder);
orderRoute.patch('/:id/cancel', validate(cancelOrderSchema), handleCancelOrder);

export default orderRoute;
