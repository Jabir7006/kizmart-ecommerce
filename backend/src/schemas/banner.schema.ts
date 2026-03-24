import { z, optional } from 'zod';
import { imageSchema } from './product.schema.js';
import { BANNER_TYPES, BANNER_STATUSES } from '../models/banner.model.js';

const bannerCoreSchema = z.object({
  image: imageSchema,
  link: z.url('Invalid link URL').min(1, 'Link cannot be empty'),
  status: z.enum(BANNER_STATUSES).default('active'),
  displayOrder: z.number().int().nonnegative().default(0),
  type: z.enum(BANNER_TYPES).default('banner'),
  startDate: optional(z.coerce.date()),
  endDate: optional(z.coerce.date()),
});

const bannerRefinement = (data: any) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
};

export const createBannerSchema = z.object({
  body: bannerCoreSchema.refine(bannerRefinement, {
    message: 'End date must be after start date',
    path: ['endDate'],
  }),
});

export const updateBannerSchema = z.object({
  params: z.object({
    id: z.string({ error: 'Banner ID is required' }),
  }),
  body: bannerCoreSchema.partial().refine(bannerRefinement, {
    message: 'End date must be after start date',
    path: ['endDate'],
  }),
});
