import { z } from 'zod';

const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  }),
});

const removeFromCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
});

const updateQuantitySchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number(),
  }),
});

export { addToCartSchema, removeFromCartSchema, updateQuantitySchema };
