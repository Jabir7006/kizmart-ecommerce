import { z } from "zod";

// MongoDB ObjectId validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const imageSchema = z.object({
  public_id: z
    .string({ error: "Image public_id is required" })
    .min(1, "Image public_id is required"),
  url: z.string({ error: "Image URL is required" }).url("Invalid image URL"),
});

export const createProductSchema = z.object({
  title: z
    .string({ error: "Product title is required" })
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters long"),

  description: z
    .string({ error: "Product description is required" })
    .min(10, "Description must be at least 10 characters long"),

  price: z
    .number({ error: "Product price is required" })
    .min(0, "Price must be greater than or equal to 0"),

  discountType: z
    .enum(["percentage", "fixed"])
    .optional()
    .default("percentage"),

  discount: z
    .number()
    .min(0, "Discount must be greater than or equal to 0")
    .optional(),

  images: z
    .array(imageSchema, {
      error: "At least one product image is required",
    })
    .min(1, "At least one image is required"),

  category: z
    .string({ error: "Product category is required" })
    .regex(objectIdRegex, "Invalid category ID format"),

  brand: z.string().regex(objectIdRegex, "Invalid brand ID format").optional(),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .min(0, "Quantity must be greater than or equal to 0")
    .default(0),

  stockStatus: z
    .enum(["in stock", "out of stock", "low stock"])
    .optional()
    .default("in stock"),

  isFeatured: z.boolean().optional().default(false),
});

export const productIdParam = z.object({
  id: z.string().regex(objectIdRegex, "Invalid MongoDB ObjectId format"),
});

export const productQuerySchema = z.object({
  // Search keyword (optional)
  search: z.string().optional(),

  // Filtering (e.g., price[gte]=500)
  category: z.string().optional(),
  brand: z.string().optional(),
  price: z
    .union([
      z.string(),
      z.object({
        gte: z.string().optional(),
        gt: z.string().optional(),
        lte: z.string().optional(),
        lt: z.string().optional(),
      }),
    ])
    .optional(),

  // Sorting: e.g. sort=price,-ratings
  sort: z
    .string()
    .regex(/^[-a-zA-Z0-9_,]+$/, "Invalid sort format")
    .optional(),

  // Fields selection: fields=title,price
  fields: z
    .string()
    .regex(/^[a-zA-Z0-9_,]+$/, "Invalid fields format")
    .optional(),

  // Pagination
  page: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, { message: "Page must be greater than 0" })
    .optional(),

  limit: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .optional(),
});
