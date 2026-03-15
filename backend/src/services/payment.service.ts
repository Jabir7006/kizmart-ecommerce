import { HTTP_STATUS } from '../constants/http.js';
import AppError from '../utils/AppError.js';
import Payment from '../models/payment.model.js';
import type { PaymentStatus } from '../models/payment.model.js';

export const getPaymentById = async (paymentId: string, userId: string) => {
  const payment = await Payment.findById(paymentId)
    .populate({
      path: 'order',
      select: 'user status total',
    })
    .lean();

  if (!payment) {
    throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
  }

  const order = payment.order as unknown as { user?: { toString: () => string } } | null;
  if (!order || typeof order.user === 'undefined' || order.user?.toString() !== userId) {
    throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
  }

  return payment;
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: PaymentStatus,
) => {
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { status },
    { new: true, runValidators: true },
  ).lean();

  if (!payment) {
    throw new AppError('Payment not found', HTTP_STATUS.NOT_FOUND);
  }

  return payment;
};
