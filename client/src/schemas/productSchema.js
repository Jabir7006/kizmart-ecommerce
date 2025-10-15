import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be less than 100 characters long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),

  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .min(0, "Price must be greater than 0")
    .positive("Price must be greater than 0"),

  discountType: z.enum(["percentage", "fixed"]).default("percentage"),

  discount: z
    .number({ invalid_type_error: "Discount must be a number" })
    .min(0, "Discount must be greater than or equal to 0")
    .optional()
    .or(z.literal(0)),

  images: z
    .array(
      z.object({
        public_id: z.string().min(1, "Image public_id is required"),
        url: z.string().url("Must be a valid URL"),
      })
    )
    .min(1, "At least one product image is required")
    .optional(),

  category: z.string().min(1, "Category is required"),

  brand: z.string().optional(),

  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .min(0, "Quantity must be greater than or equal to 0")
    .default(0),

  stockStatus: z
    .enum(["in stock", "out of stock", "low stock"])
    .default("in stock"),

  isFeatured: z.boolean().default(false),
});
