import { optional, z } from 'zod';
import { imageSchema } from './product.schema.js';

const brandCoreSchema = z.object({
  title: z
    .string({ error: 'Brand title is required' })
    .min(2, { error: 'Title must be at least 2 characters long' })
    .max(100, { error: 'Title cannot exceed 100 characters' }),
  logo: optional(imageSchema),
});

const brandUpdateCoreSchema = brandCoreSchema.extend({
  logo: imageSchema.nullish(),
});

export const createBrandSchema = z.object({
  body: brandCoreSchema,
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string({ error: 'Brand ID is required' }),
  }),
  body: brandUpdateCoreSchema.partial(),
});
