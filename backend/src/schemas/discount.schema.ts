import { z } from 'zod';

const discountListStatusSchema = z.enum([
  'active',
  'inactive',
  'upcoming',
  'expired',
]);

const discountCoreSchema = z.object({
  name: z.string({ error: 'Discount name is required' }).min(1),
  discountType: z.enum(['percentage', 'fixed'], {
    error: 'Discount type must be "percentage" or "fixed"',
  }),
  value: z
    .number({ error: 'Discount value is required' })
    .positive({ message: 'Value must be greater than 0' }),
  targetType: z.enum(['product', 'category', 'all'], {
    error: 'Target type must be "product", "category", or "all"',
  }),
  targetProducts: z.array(z.string()).default([]),
  targetCategories: z.array(z.string()).default([]),
  startDate: z.string({ error: 'Start date is required' }),
  endDate: z.string({ error: 'End date is required' }),
  isActive: z.boolean().default(true),
});

export const createDiscountSchema = z.object({
  body: discountCoreSchema
    .refine(
      (data) => {
        if (data.discountType === 'percentage' && data.value > 100) {
          return false;
        }
        return true;
      },
      { message: 'Percentage discount cannot exceed 100%', path: ['value'] },
    )
    .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
      message: 'Start date must be before end date',
      path: ['endDate'],
    }),
});

export const updateDiscountSchema = z.object({
  params: z.object({
    id: z.string({ error: 'Discount ID is required' }),
  }),
  body: discountCoreSchema.partial(),
});

export const getDiscountsQuerySchema = z.object({
  query: z.object({
    q: z.string().trim().optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    targetType: z.enum(['product', 'category', 'all']).optional(),
    isActive: z
      .enum(['true', 'false'])
      .optional()
      .transform((value) =>
        value === undefined ? undefined : value === 'true',
      ),
    status: discountListStatusSchema.optional(),
    sortBy: z
      .enum(['createdAt', 'updatedAt', 'startDate', 'endDate', 'name', 'value'])
      .optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});
