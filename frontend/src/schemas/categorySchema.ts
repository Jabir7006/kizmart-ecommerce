import { z } from "zod";
import type { Control } from "react-hook-form";

// ─── Shared image shape (already-uploaded Cloudinary record) ───────────────
const existingImageSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string(),
  mobileUrl: z.string().optional(),
  altText: z.string().optional(),
});

// ─── Base schema ───────────────────────────────────────────────────────────
const baseCategorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
});

// ─── Create schema (new category – thumbnail is optional) ────────────
export const categorySchema = baseCategorySchema.extend({
  thumbnail: z.instanceof(File).optional(),
});

// ─── Edit schema (thumbnail can be existing OR a new File, both optional) ─────────
export const editCategorySchema = baseCategorySchema.extend({
  thumbnail: z.union([z.instanceof(File), existingImageSchema]).nullish(),
});

// ─── Types ─────────────────────────────────────────────────────────────────
export type CategoryFormInput = z.input<typeof categorySchema>;
export type CategoryFormOutput = z.output<typeof categorySchema>;
export type CategoryFormValues = CategoryFormOutput;

export type CategoryEditFormInput = z.input<typeof editCategorySchema>;
export type CategoryEditFormOutput = z.output<typeof editCategorySchema>;

export interface CategoryFormSectionProps {
  control: Control<any>;
}
