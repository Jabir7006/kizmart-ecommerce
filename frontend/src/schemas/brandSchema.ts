import { z } from "zod";
import type { Control } from "react-hook-form";

const existingImageSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string(),
  mobileUrl: z.string().optional(),
  altText: z.string().optional(),
});

const baseBrandSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
});

export const brandSchema = baseBrandSchema.extend({
  logo: z.instanceof(File).optional(),
});

export const editBrandSchema = baseBrandSchema.extend({
  logo: z.union([z.instanceof(File), existingImageSchema]).nullish(),
});

export type BrandFormInput = z.input<typeof brandSchema>;
export type BrandFormOutput = z.output<typeof brandSchema>;
export type BrandFormValues = BrandFormOutput;

export type BrandEditFormInput = z.input<typeof editBrandSchema>;
export type BrandEditFormOutput = z.output<typeof editBrandSchema>;

export interface BrandFormSectionProps {
  control: Control<any>;
}
