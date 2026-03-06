import { z } from 'zod';

export const imageSchema = z.object({
  publicId: z.string({ error: 'Public ID is required' }),
  secureUrl: z.url({ error: 'Invalid URL' }),
  altText: z.string().default(''),
});

const productCoreSchema = z.object({
  title: z
    .string({ error: 'Product title is required' })
    .max(160, { error: 'Title cannot exceed 160 characters' }),
  shortDescription: z.string({ error: 'Short description is required' }),
  longDescription: z.string({ error: 'Long description is required' }),
  thumbnail: imageSchema,
  gallery: z.array(imageSchema).default([]),
  price: z
    .number({ error: 'Price is required' })
    .min(0, { error: 'Price cannot be negative' }),
  quantity: z
    .number({ error: 'Quantity is required' })
    .min(0, { error: 'Quantity cannot be negative' }),
  sold: z.number().min(0).default(0),
  category: z.string({ error: 'Category is required' }),
  brand: z.string().optional(),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
  ratings: z.number().min(0).max(5).default(0),
  numReviews: z.number().min(0).default(0),
  isFeatured: z.boolean().default(false),
});

export const createProductSchema = z.object({
  body: productCoreSchema,
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string({ error: 'Product ID is required' }),
  }),
  body: productCoreSchema.partial(),
});
