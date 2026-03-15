import { HTTP_STATUS } from '../constants/http.js';
import {
  getPaymentById,
  updatePaymentStatus,
} from '../services/payment.service.js';
import catchAsync from '../utils/catchAsync.js';

export const handleGetPayment = catchAsync(async (req, res) => {
  const userId = req.user!.userId;
  const payment = await getPaymentById(req.params.id as string, userId);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    data: payment,
  });
});

export const handleUpdatePaymentStatus = catchAsync(async (req, res) => {
  const { status } = req.body as { status: 'pending' | 'paid' | 'failed' | 'refunded' };
  const payment = await updatePaymentStatus(req.params.id as string, status);

  res.status(HTTP_STATUS.SUCCESS).json({
    status: 'success',
    message: 'Payment status updated',
    data: payment,
  });
});
