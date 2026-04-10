import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const ratingSchema = z
  .union([z.string(), z.number()])
  .transform((value) => Number(value))
  .refine(
    (value) => Number.isFinite(value) && Number.isInteger(value),
    "Rating must be a whole number",
  )
  .refine((value) => value >= 1 && value <= 5, "Rating must be between 1 and 5");

const commentSchema = z
  .string()
  .trim()
  .min(1, "Review comment is required")
  .max(1000, "Review comment cannot exceed 1000 characters");

export const reviewSchema = z.object({
  product: objectIdSchema,
  rating: ratingSchema,
  comment: commentSchema,
});

export const updateReviewSchema = z
  .object({
    rating: ratingSchema.optional(),
    comment: commentSchema.optional(),
  })
  .refine(
    (data) => data.rating !== undefined || data.comment !== undefined,
    "At least one field is required",
  );

export type ReviewFormInput = z.input<typeof reviewSchema>;
export type ReviewFormOutput = z.output<typeof reviewSchema>;

export type UpdateReviewFormInput = z.input<typeof updateReviewSchema>;
export type UpdateReviewFormOutput = z.output<typeof updateReviewSchema>;
