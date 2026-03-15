import { z } from 'zod';

const paymentStatusEnum = z.enum(['pending', 'paid', 'failed', 'refunded']);

export const getPaymentSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Payment ID is required'),
  }),
});

export const updatePaymentStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Payment ID is required'),
  }),
  body: z.object({
    status: paymentStatusEnum,
  }),
});
