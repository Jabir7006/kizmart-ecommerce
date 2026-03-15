import express from 'express';
import {
  handleGetPayment,
  handleUpdatePaymentStatus,
} from '../controllers/payment.controller.js';
import {
  getPaymentSchema,
  updatePaymentStatusSchema,
} from '../schemas/payment.schema.js';
import validate from '../middlewares/validate.middleware.js';
import { restrictTo } from '../middlewares/auth.middleware.js';

const paymentRoute = express.Router();

paymentRoute.get('/:id', validate(getPaymentSchema), handleGetPayment);
paymentRoute.patch(
  '/:id/status',
  validate(updatePaymentStatusSchema),
  restrictTo('admin', 'manager'),
  handleUpdatePaymentStatus,
);

export default paymentRoute;
