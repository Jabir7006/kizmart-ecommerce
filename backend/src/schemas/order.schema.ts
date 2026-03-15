import { z } from 'zod';

const orderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

const shippingSnapshotSchema = z.object({
  fullName: z.string({ message: 'Full name is required' }).min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string({ message: 'Phone number is required' }).min(10, 'Invalid phone number'),
  streetAddress: z.string({ message: 'Street address is required' }).min(5, 'Street address is too short'),
  city: z.string({ message: 'City is required' }),
  state: z.string({ message: 'State is required' }),
  postalCode: z.string({ message: 'Postal code is required' }),
});

export const createOrderSchema = z.object({
  body: z.object({
    items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
    shippingAddress: shippingSnapshotSchema,
    paymentMethod: z.literal('cash_on_delivery'),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Order ID is required'),
  }),
});

export const getOrdersSchema = z.object({
  query: z.object({
    status: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
  }).optional(),
});
