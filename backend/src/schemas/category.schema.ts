import { z, optional } from 'zod';
import { imageSchema } from './product.schema.js';

const categoryCoreSchema = z.object({
  title: z
    .string({ error: 'Category title is required' })
    .min(2, { error: 'Title must be at least 2 characters long' })
    .max(100, { error: 'Title cannot exceed 100 characters' }),
  thumbnail: optional(imageSchema),
});

// For updates, thumbnail can be null (explicit removal) or an image object
const categoryUpdateCoreSchema = categoryCoreSchema.extend({
  thumbnail: imageSchema.nullish(),
});

export const createCategorySchema = z.object({
  body: categoryCoreSchema,
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string({ error: 'Category ID is required' }),
  }),
  body: categoryUpdateCoreSchema.partial(),
});
