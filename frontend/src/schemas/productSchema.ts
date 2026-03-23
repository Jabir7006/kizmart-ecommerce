import { z } from "zod";
import type { Control } from "react-hook-form";

export const productSchema = z.object({
  title: z.string().min(1, "Title is required").max(160, "Max 160 characters"),
  shortDescription: z.string().min(1, "Short description is required"),
  longDescription: z.string().min(1, "Long description is required"),
  price: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, "Price cannot be negative"),
  quantity: z
    .union([z.string(), z.number()])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, "Quantity cannot be negative"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  status: z.enum(["draft", "active", "archived"]),
  isFeatured: z.boolean().default(false),
  thumbnail: z.instanceof(File, { message: "Thumbnail is required" }),
  gallery: z.array(z.instanceof(File)).default([]),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormOutput = z.output<typeof productSchema>;
export type ProductFormValues = ProductFormOutput;

export interface ProductInput {
  title: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  quantity: number;
  category: string;
  brand?: string;
  status: "draft" | "active" | "archived";
  isFeatured: boolean;
  thumbnail: { publicId: string; secureUrl: string };
  gallery?: { publicId: string; secureUrl: string }[];
}

export interface ProductFormSectionProps {
  control: Control<ProductFormInput, any>;
}
