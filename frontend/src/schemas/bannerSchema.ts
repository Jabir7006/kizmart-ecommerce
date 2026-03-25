import { z } from 'zod';
import type { Control } from 'react-hook-form';

// ─── Shared: existing Cloudinary image record ───────────────────────────────
const existingImageSchema = z.object({
  publicId: z.string(),
  secureUrl: z.string(),
  mobileUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  altText: z.string().optional(),
});

// ─── Core banner fields ─────────────────────────────────────────────────────
const bannerCoreSchema = z.object({
  image: z.union([z.instanceof(File), existingImageSchema], {
    error: 'Banner image is required',
  }),
  link: z.url('Must be a valid URL').min(1, 'Link is required'),
  type: z.enum(['banner', 'promo', 'offer']).default('banner'),
  status: z.enum(['active', 'inactive']).default('active'),
  displayOrder: z.coerce.number().int().nonnegative().default(0),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ─── Create schema ──────────────────────────────────────────────────────────
export const createBannerSchema = bannerCoreSchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  { message: 'End date must be after start date', path: ['endDate'] },
);

// ─── Edit schema (image can be existing OR new File) ────────────────────────
export const editBannerSchema = bannerCoreSchema.refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.endDate) > new Date(data.startDate);
    }
    return true;
  },
  { message: 'End date must be after start date', path: ['endDate'] },
);

// ─── Types ──────────────────────────────────────────────────────────────────
export type BannerFormInput = z.input<typeof editBannerSchema>;
export type BannerFormOutput = z.output<typeof editBannerSchema>;

export interface BannerFormSectionProps {
  control: Control<any>;
}
