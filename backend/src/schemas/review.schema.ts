import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
  error: 'Invalid MongoDB ObjectId',
});

const reviewCoreSchema = z.object({
  product: objectIdSchema,
  rating: z
    .number({ error: 'Rating is required' })
    .min(1, { error: 'Rating must be at least 1' })
    .max(5, { error: 'Rating cannot be more than 5' }),
  comment: z
    .string({ error: 'Review comment is required' })
    .min(1, { error: 'Review comment is required' })
    .max(1000, { error: 'Review comment cannot exceed 1000 characters' }),
});

export const createReviewSchema = z.object({
  body: reviewCoreSchema,
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: reviewCoreSchema.omit({ product: true }).partial(),
});

export const getReviewSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const getAllReviewsSchema = z.object({
  query: z.object({
    productId: objectIdSchema,
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z
      .enum(['newest', 'oldest', 'highest-rating', 'lowest-rating'])
      .optional(),
    star: z.coerce.number().int().min(1).max(5).optional(),
  }),
});
