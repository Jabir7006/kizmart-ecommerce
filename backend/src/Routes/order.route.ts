import express from 'express';
import {
  handleCreateOrder,
  handleGetOrder,
  handleGetOrders,
  handleCancelOrder,
} from '../controllers/order.controller.js';
import {
  createOrderSchema,
  getOrderSchema,
  getOrdersSchema,
  cancelOrderSchema,
} from '../schemas/order.schema.js';
import validate from '../middlewares/validate.middleware.js';

const orderRoute = express.Router();

orderRoute.post('/', validate(createOrderSchema), handleCreateOrder);
orderRoute.get('/', validate(getOrdersSchema), handleGetOrders);
orderRoute.get('/:id', validate(getOrderSchema), handleGetOrder);
orderRoute.patch('/:id/cancel', validate(cancelOrderSchema), handleCancelOrder);

export default orderRoute;
